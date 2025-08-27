"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import VerseDisplay from "@/components/verse-display"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ScriptText from "@/components/script-text"
import { ChevronsUpDown } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export interface VerseDetailProps {
  verse: {
    number: number
    original: string
    transliteration: string
    translation: string
    commentaries: { [key: string]: string }
    sectionInfo?: {
      path: (number | string)[] // Array of section numbers representing the full path
      title: string
    }
  }
  hasNextVerse: boolean
  hasPrevVerse: boolean
  totalVerses: number
  onNavigate: (direction: "prev" | "next") => void
  selectedTab: string
  onTabChange: (value: string) => void
  scriptureSlug: string
  initialCommentaries?: string[]
}

export default function VerseDetail({ 
  verse, 
  hasNextVerse, 
  hasPrevVerse, 
  totalVerses, 
  onNavigate,
  selectedTab,
  onTabChange,
  scriptureSlug,
  initialCommentaries
}: VerseDetailProps) {
  const searchParams = useSearchParams()
  const commentaryParam = searchParams.get("commentary")
  const [selectedCommentators, setSelectedCommentators] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    // Initialize selected commentators from URL or first available
    const commentators = Object.keys(verse.commentaries)
    if (commentators.length > 0) {
      if (initialCommentaries) {
        // Use the initial commentaries if provided
        const selected = initialCommentaries.filter(c => commentators.includes(c))
        setSelectedCommentators(selected.length > 0 ? selected : [commentators[0]])
      } else if (commentaryParam) {
        // Fall back to URL param if no initial commentaries
        const selected = commentaryParam.split(',').filter(c => commentators.includes(c))
        setSelectedCommentators(selected.length > 0 ? selected : [commentators[0]])
      } else {
        // Default to first commentary if no selection
        setSelectedCommentators([commentators[0]])
      }
    } else {
      // If no commentaries available, clear selection
      setSelectedCommentators([])
    }
  }, [commentaryParam, verse.commentaries, verse.number, initialCommentaries])

  const handleCommentaryChange = (value: string) => {
    const commentators = Object.keys(verse.commentaries)
    let newSelected: string[]
    
    if (value === "all") {
      newSelected = commentators
    } else {
      newSelected = selectedCommentators.includes(value)
        ? selectedCommentators.filter(c => c !== value)
        : [...selectedCommentators, value]
      
      // Don't allow deselecting if it's the last selected item
      if (newSelected.length === 0) {
        newSelected = [value]
      }
    }
    
    setSelectedCommentators(newSelected)
    
    // Use router.push instead of window.history.pushState
    const url = new URL(window.location.href)
    // Always set the commentary parameter, even for "all"
    url.searchParams.set("commentary", newSelected.join(','))
    router.push(url.toString())
  }

  // Format the verse number based on the section path
  const getFormattedVerseNumber = () => {
    if (!verse.sectionInfo?.path) return `Verse ${verse.number}`
    return `Verse ${[...verse.sectionInfo.path, verse.number].join('.')}`
  }

  const commentators = Object.keys(verse.commentaries)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="px-4 sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:mb-6">
          {verse.sectionInfo && (
            <div className="text-sm text-muted-foreground">
              Chapter {verse.sectionInfo.path[0]}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              {verse.sectionInfo ? `Verse ${verse.sectionInfo.path[0]}.${verse.number}` : `Verse ${verse.number}`}
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                onClick={() => onNavigate("prev")}
                disabled={!hasPrevVerse}
                className="flex-1 sm:flex-none"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => onNavigate("next")}
                disabled={!hasNextVerse}
                className="flex-1 sm:flex-none"
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="w-full justify-start mb-4 sm:mb-6">
              <TabsTrigger value="original" className="flex-1">Original</TabsTrigger>
              {verse.transliteration && (
                <TabsTrigger value="transliteration" className="flex-1">Transliteration</TabsTrigger>
              )}
              {verse.translation && (
                <TabsTrigger value="translation" className="flex-1">Translation</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="original">
              <ScriptText text={verse.original} />
            </TabsContent>
            {verse.transliteration && (
              <TabsContent value="transliteration">
                <ScriptText text={verse.transliteration} />
              </TabsContent>
            )}
            {verse.translation && (
              <TabsContent value="translation">
                <ScriptText text={verse.translation} />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {commentators.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">Commentaries</h3>
            <Select
              value={selectedCommentators.length === commentators.length ? "all" : "default"}
              onValueChange={handleCommentaryChange}
            >
              <SelectTrigger className="w-full sm:w-[250px] mb-3 sm:mb-4 bg-background text-base">
                <SelectValue>
                  {selectedCommentators.length === commentators.length
                    ? "All Commentaries"
                    : selectedCommentators.length === 0
                    ? "Select commentaries"
                    : `${selectedCommentators.length} selected`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="item-aligned" side="bottom" align="start" className="max-h-[300px]">
                <SelectItem value="all" className="text-base">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      selectedCommentators.length === commentators.length ? "bg-primary" : "bg-muted"
                    )} />
                    All Commentaries
                  </div>
                </SelectItem>
                {commentators.map((commentator) => (
                  <SelectItem key={commentator} value={commentator} className="text-base">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        selectedCommentators.includes(commentator) ? "bg-primary" : "bg-muted"
                      )} />
                      {commentator}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-4 sm:space-y-6">
              {selectedCommentators.map((commentator) => (
                <div key={commentator} className="prose prose-zinc dark:prose-invert max-w-none">
                  <h4 className="text-lg sm:text-xl font-semi-bold text-primary">Commentary by {commentator}</h4>
                  <div className="break-words whitespace-pre-wrap">
                    <ScriptText text={verse.commentaries[commentator]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => onNavigate("prev")}
              disabled={!hasPrevVerse}
              className="flex-1"
            >
              Previous Verse
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigate("next")}
              disabled={!hasNextVerse}
              className="flex-1"
            >
              Next Verse
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 