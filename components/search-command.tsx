"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Search, Book, FileText, Tag } from "lucide-react"
import type { SearchResult } from "@/app/api/search/route"

interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [query, search])

  const handleSelect = useCallback((result: SearchResult) => {
    router.push(result.url)
    onOpenChange(false)
    setQuery("")
  }, [router, onOpenChange])

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'scripture':
        return <Book className="mr-2 h-4 w-4" />
      case 'verse':
        return <FileText className="mr-2 h-4 w-4" />
      case 'category':
        return <Tag className="mr-2 h-4 w-4" />
      default:
        return <Search className="mr-2 h-4 w-4" />
    }
  }

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search scriptures, verses, and categories..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            <Search className="mr-2 h-4 w-4 animate-pulse" />
            Searching...
          </div>
        )}
        
        {!loading && query.length >= 2 && results.length === 0 && (
          <CommandEmpty>No results found for "{query}"</CommandEmpty>
        )}

        {Object.entries(groupedResults).map(([type, typeResults]) => (
          <CommandGroup key={type} heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'}>
            {typeResults.map((result, index) => (
              <CommandItem
                key={`${type}-${index}`}
                value={`${result.title} ${result.subtitle || ''} ${result.content || ''}`}
                onSelect={() => handleSelect(result)}
                className="flex flex-col items-start space-y-1"
              >
                <div className="flex items-center">
                  {getIcon(result.type)}
                  <span className="font-medium">{result.title}</span>
                </div>
                {result.subtitle && (
                  <span className="text-sm text-muted-foreground ml-6">{result.subtitle}</span>
                )}
                {result.content && (
                  <span className="text-xs text-muted-foreground ml-6 line-clamp-2">{result.content}</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}

export function useSearchCommand() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return { open, setOpen }
}