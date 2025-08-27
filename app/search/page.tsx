"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Book, FileText, Tag } from "lucide-react"
import Link from "next/link"
import type { SearchResult } from "@/app/api/search/route"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchQuery = async () => {
      if (!query?.trim() || query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        }
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    searchQuery()
  }, [query])

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'scripture':
        return <Book className="h-5 w-5" />
      case 'verse':
        return <FileText className="h-5 w-5" />
      case 'category':
        return <Tag className="h-5 w-5" />
      default:
        return <Search className="h-5 w-5" />
    }
  }

  const getBadgeVariant = (type: SearchResult['type']) => {
    switch (type) {
      case 'scripture':
        return 'default'
      case 'verse':
        return 'secondary'
      case 'category':
        return 'outline'
      default:
        return 'default'
    }
  }

  if (!query || query.length < 2) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-12">
            <CardContent className="space-y-6">
              <Search className="h-16 w-16 mx-auto text-primary" />
              <h1 className="text-3xl font-bold text-primary">Search Śrīkoṣa</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Search through sacred texts, verses, and commentaries. Use the search bar above or press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">⌘K</kbd> to get started.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            {loading ? 'Searching...' : `${results.length} results for "${query}"`}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Search className="h-8 w-8 animate-pulse text-primary mr-3" />
            <span className="text-lg">Searching through scriptures...</span>
          </div>
        )}

        {!loading && results.length === 0 && (
          <Card className="text-center p-8">
            <CardContent className="space-y-4">
              <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">No results found</h2>
              <p className="text-muted-foreground">
                Try different keywords or check your spelling. You can search for scripture names, authors, verses, or categories.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {results.map((result, index) => (
            <Link key={index} href={result.url}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-primary">
                        {getIcon(result.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{result.title}</CardTitle>
                        {result.subtitle && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={getBadgeVariant(result.type)}>
                      {result.type}
                    </Badge>
                  </div>
                </CardHeader>
                {result.content && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {result.content}
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

