"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { Scripture, ScriptureContent } from "@/lib/types"
import VerseDetail from "@/components/verse-detail"

interface ScriptureViewerProps {
  scripture: Scripture
  content: ScriptureContent
}

export default function ScriptureViewer({ scripture, content }: ScriptureViewerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const verseParam = searchParams.get("verse")
  const commentaryParam = searchParams.get("commentary")
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [selectedTab, setSelectedTab] = useState("original")

  // Initialize state from URL parameters
  useEffect(() => {
    if (verseParam) {
      const verseNumber = Number.parseInt(verseParam, 10)
      const index = content.verses.findIndex((v) => v.verse_number === verseNumber)
      if (index !== -1) {
        setCurrentVerseIndex(index)
      }
    }
  }, [verseParam, content.verses])

  const currentVerse = content.verses[currentVerseIndex]
  const totalVerses = content.verses.length

  const handleVerseChange = (direction: "prev" | "next") => {
    const newVerseNumber = direction === "next" ? currentVerseIndex + 1 : currentVerseIndex - 1
    const newUrl = new URL(window.location.href)
    newUrl.pathname = `/scripture/${scripture.metadata.slug}/verse/${newVerseNumber}`
    
    // Preserve all existing search params
    const currentSearchParams = new URLSearchParams(window.location.search)
    currentSearchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value)
    })
    
    // Use router.push instead of window.history.pushState
    router.push(newUrl.toString())
  }

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
  }

  // Transform commentaries into the format expected by VerseDetail
  const commentaries = currentVerse.commentaries.reduce((acc, c) => ({
    ...acc,
    [c.author]: c.commentary
  }), {})

  return (
    <VerseDetail
      verse={{
        number: currentVerse.verse_number,
        original: currentVerse.original_text,
        transliteration: currentVerse.iast_text || "",
        translation: currentVerse.english_translation || "",
        commentaries,
        sectionInfo: undefined // We don't have section info in the current data structure
      }}
      hasNextVerse={currentVerseIndex < totalVerses - 1}
      hasPrevVerse={currentVerseIndex > 0}
      totalVerses={totalVerses}
      onNavigate={handleVerseChange}
      selectedTab={selectedTab}
      onTabChange={handleTabChange}
      scriptureSlug={scripture.metadata.slug}
      initialCommentaries={commentaryParam ? commentaryParam.split(',') : undefined}
    />
  )
}

