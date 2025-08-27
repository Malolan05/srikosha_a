import { notFound } from "next/navigation"
import { getScripture } from "@/lib/utils"
import type { Metadata } from "next"
import { VerseDetailWrapper } from "@/components/verse-detail-wrapper"
import { Verse } from "@/lib/types"

interface VersePageProps {
  params: {
    slug: string
    verseNumber: string
  }
}

interface ScriptureSection {
  title: string
  number: string | number
  verses?: Verse[]
  sections?: ScriptureSection[]
}

interface ScriptureContent {
  title: string
  sections: ScriptureSection[]
}

interface EnhancedVerse extends Verse {
  absoluteNumber: number;
  sectionInfo: {
    path: (number | string)[];
    title: string;
  };
}

function findVerseAndTotalCount(content: ScriptureContent, targetVerseNumber: number): { 
  verse: EnhancedVerse | null, 
  allVerses: EnhancedVerse[],
  verseMapping: Map<number, number>
} {
  const allVerses: EnhancedVerse[] = []
  let foundVerse: EnhancedVerse | null = null
  let absoluteVerseCount = 0
  const verseMapping = new Map<number, number>()

  // Function to process a single section
  const processSection = (section: ScriptureSection, path: (number | string)[] = []) => {
    const currentPath = [...path, section.number]
    
    // Process verses in this section
    if (section.verses && Array.isArray(section.verses)) {
      section.verses.forEach((verse: Verse) => {
        absoluteVerseCount++
        const enhancedVerse: EnhancedVerse = {
          ...verse,
          absoluteNumber: absoluteVerseCount,
          sectionInfo: {
            path: currentPath,
            title: section.title
          }
        }
        allVerses.push(enhancedVerse)
        verseMapping.set(absoluteVerseCount, verse.verse_number)
        
        // If this is the target verse number and it hasn't been found yet
        if (absoluteVerseCount === targetVerseNumber) {
          foundVerse = enhancedVerse
        }
      })
    }

    // Process subsections if they exist
    if (section.sections && Array.isArray(section.sections)) {
      section.sections.forEach((subsection: ScriptureSection) => {
        processSection(subsection, currentPath)
      })
    }
  }

  // Process all chapters/sections
  if (content.sections && Array.isArray(content.sections)) {
    content.sections.forEach((chapter: ScriptureSection) => {
      processSection(chapter)
    })
  }

  // Log for debugging
  console.log('All verses:', allVerses.map(v => ({
    absoluteNumber: v.absoluteNumber,
    originalNumber: v.verse_number,
    path: v.sectionInfo.path,
    title: v.sectionInfo.title
  })))

  return { 
    verse: foundVerse, 
    allVerses: allVerses.sort((a, b) => {
      // First compare by chapter number
      const chapterA = Number(a.sectionInfo.path[0])
      const chapterB = Number(b.sectionInfo.path[0])
      if (chapterA !== chapterB) return chapterA - chapterB
      
      // If in same chapter, compare by verse number
      return a.verse_number - b.verse_number
    }),
    verseMapping
  }
}

export async function generateMetadata({ params }: VersePageProps): Promise<Metadata> {
  const scripture = await getScripture(params.slug)
  const verseNumber = parseInt(params.verseNumber)

  if (!scripture) {
    return {
      title: "Verse Not Found",
      description: "The requested verse could not be found.",
    }
  }

  return {
    title: `Verse ${verseNumber} - ${scripture.metadata.scripture_name}`,
    description: `Verse ${verseNumber} from ${scripture.metadata.scripture_name} by ${scripture.metadata.author}`,
  }
}

export default async function VersePage({ params }: VersePageProps) {
  const scripture = await getScripture(params.slug)
  
  if (!scripture) {
    notFound()
  }

  const verseNumber = parseInt(params.verseNumber)
  const { verse, allVerses, verseMapping } = findVerseAndTotalCount(scripture.content, verseNumber)

  if (!verse) {
    notFound()
  }

  // Transform verse data to match VerseDetail props
  const verseData = {
    number: verse.verse_number,
    original: verse.original_text,
    transliteration: verse.iast_text || "",
    translation: verse.english_translation || "",
    commentaries: verse.commentaries.reduce((acc: { [key: string]: string }, curr: any) => {
      acc[curr.author] = curr.commentary
      return acc
    }, {}),
    sectionInfo: verse.sectionInfo
  }

  // Get all verse numbers in order
  const sortedVerseNumbers = allVerses.map(v => v.absoluteNumber)
  const currentIndex = sortedVerseNumbers.indexOf(verseNumber)
  
  console.log('Navigation info:', {
    allVerseNumbers: sortedVerseNumbers,
    currentVerse: verseNumber,
    currentIndex,
    totalVerses: sortedVerseNumbers.length,
    verseMapping: Object.fromEntries(verseMapping)
  })

  const hasNextVerse = currentIndex < sortedVerseNumbers.length - 1
  const hasPrevVerse = currentIndex > 0

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <VerseDetailWrapper 
        verse={verseData}
        hasNextVerse={hasNextVerse}
        hasPrevVerse={hasPrevVerse}
        totalVerses={sortedVerseNumbers.length}
        scriptureSlug={params.slug}
        nextVerseNumber={hasNextVerse ? sortedVerseNumbers[currentIndex + 1] : undefined}
        prevVerseNumber={hasPrevVerse ? sortedVerseNumbers[currentIndex - 1] : undefined}
      />
    </div>
  )
} 