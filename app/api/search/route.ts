import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Scripture, Category } from "@/lib/types"

export interface SearchResult {
  type: 'scripture' | 'verse' | 'category'
  title: string
  subtitle?: string
  content?: string
  url: string
  scripture?: string
  verseNumber?: number
  category?: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase().trim()
    
    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    const results: SearchResult[] = []

    // Search categories
    const categoriesPath = path.join(process.cwd(), "data/categories.json")
    const categoriesData = await fs.readFile(categoriesPath, "utf-8")
    const categories = JSON.parse(categoriesData) as Category[]
    
    categories.forEach(category => {
      if (
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.longDescription?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'category',
          title: category.name,
          subtitle: category.description,
          url: `/${category.slug}`,
          category: category.name
        })
      }
    })

    // Search scriptures
    const scripturesDir = path.join(process.cwd(), "data/scriptures")
    const files = await fs.readdir(scripturesDir)
    
    for (const file of files.filter(f => f.endsWith('.json'))) {
      const scriptureData = await fs.readFile(path.join(scripturesDir, file), "utf-8")
      const scripture = JSON.parse(scriptureData) as Scripture
      
      // Search scripture metadata
      if (
        scripture.metadata.scripture_name.toLowerCase().includes(query) ||
        scripture.metadata.author.toLowerCase().includes(query) ||
        scripture.metadata.category.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'scripture',
          title: scripture.metadata.scripture_name,
          subtitle: `By ${scripture.metadata.author} • ${scripture.metadata.category}`,
          url: `/scripture/${scripture.metadata.slug}`,
          scripture: scripture.metadata.scripture_name,
          category: scripture.metadata.category
        })
      }

      // Search verses content
      const searchVerses = (sections: any[], sectionPath: string[] = []) => {
        sections.forEach((section, index) => {
          if (section.verses) {
            section.verses.forEach((verse: any) => {
              const searchFields = [
                verse.original_text,
                verse.iast_text,
                verse.english_translation,
                ...verse.commentaries.map((c: any) => c.commentary)
              ].filter(Boolean).join(' ').toLowerCase()

              if (searchFields.includes(query)) {
                const verseTitle = `Verse ${verse.verse_number}`
                const sectionTitle = sectionPath.length > 0 ? sectionPath.join(' • ') : section.title
                
                results.push({
                  type: 'verse',
                  title: verseTitle,
                  subtitle: `${scripture.metadata.scripture_name} • ${sectionTitle}`,
                  content: verse.english_translation || verse.original_text.substring(0, 100) + '...',
                  url: `/scripture/${scripture.metadata.slug}/verse/${verse.verse_number}`,
                  scripture: scripture.metadata.scripture_name,
                  verseNumber: verse.verse_number,
                  category: scripture.metadata.category
                })
              }
            })
          }

          if (section.sections) {
            searchVerses(section.sections, [...sectionPath, section.title])
          }
        })
      }

      if (scripture.content.sections) {
        searchVerses(scripture.content.sections)
      }
    }

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === query ? 1 : 0
      const bExact = b.title.toLowerCase() === query ? 1 : 0
      if (aExact !== bExact) return bExact - aExact
      
      const aStarts = a.title.toLowerCase().startsWith(query) ? 1 : 0
      const bStarts = b.title.toLowerCase().startsWith(query) ? 1 : 0
      if (aStarts !== bStarts) return bStarts - aStarts
      
      // Sort by type priority: categories, scriptures, then verses
      const typePriority = { category: 3, scripture: 2, verse: 1 }
      return typePriority[b.type] - typePriority[a.type]
    })

    // Limit results to avoid overwhelming the UI
    return NextResponse.json(results.slice(0, 50))
    
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}