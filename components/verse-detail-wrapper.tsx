"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import VerseDetail from "@/components/verse-detail"

interface VerseDetailWrapperProps {
  verse: {
    number: number
    original: string
    transliteration: string
    translation: string
    commentaries: {
      [key: string]: string
    }
    sectionInfo?: {
      path: (number | string)[]
      title: string
    }
  }
  hasNextVerse: boolean
  hasPrevVerse: boolean
  totalVerses: number
  scriptureSlug: string
  nextVerseNumber?: number
  prevVerseNumber?: number
}

const validTabs = ['original', 'transliteration', 'translation'] as const
type TabType = typeof validTabs[number]

function getInitialTab(searchParams: ReturnType<typeof useSearchParams>): TabType {
  const tabFromUrl = searchParams.get('tab')
  return tabFromUrl && validTabs.includes(tabFromUrl as TabType) 
    ? tabFromUrl as TabType 
    : 'original'
}

export function VerseDetailWrapper({ 
  verse, 
  hasNextVerse, 
  hasPrevVerse, 
  totalVerses, 
  scriptureSlug,
  nextVerseNumber,
  prevVerseNumber
}: VerseDetailWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize from URL params immediately to prevent flashing
  const [mounted, setMounted] = useState(false)
  const currentTab = getInitialTab(searchParams)

  // Sync localStorage with URL params after mount
  useEffect(() => {
    setMounted(true)
    localStorage.setItem('selectedVerseTab', currentTab)
  }, [currentTab])

  const handleTabChange = useCallback((value: string) => {
    if (!validTabs.includes(value as TabType)) return
    
    localStorage.setItem('selectedVerseTab', value)
    
    // Update URL without navigation using router.replace
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('tab', value)
    router.replace(`/scripture/${scriptureSlug}/verse/${verse.number}?${newParams.toString()}`, {
      scroll: false
    })
  }, [router, scriptureSlug, verse.number, searchParams])

  const handleNavigation = useCallback((direction: "prev" | "next") => {
    const newVerseNumber = direction === "prev" ? prevVerseNumber : nextVerseNumber
    if (newVerseNumber) {
      // Navigate to new verse while preserving tab and other query params
      const newParams = new URLSearchParams(searchParams.toString())
      if (!newParams.has('tab')) {
        newParams.set('tab', currentTab)
      }
      router.push(`/scripture/${scriptureSlug}/verse/${newVerseNumber}?${newParams.toString()}`)
    }
  }, [scriptureSlug, nextVerseNumber, prevVerseNumber, currentTab, router, searchParams])

  return (
    <VerseDetail
      verse={verse}
      hasNextVerse={hasNextVerse}
      hasPrevVerse={hasPrevVerse}
      totalVerses={totalVerses}
      onNavigate={handleNavigation}
      selectedTab={currentTab}
      onTabChange={handleTabChange}
      scriptureSlug={scriptureSlug}
    />
  )
} 