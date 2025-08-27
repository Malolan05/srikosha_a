"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Section, TextDisplayMode } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SectionFilter } from "@/components/section-filter"
import { Card } from "@/components/ui/card"
import ScriptText from "@/components/script-text"

interface ScriptureContentProps {
  sections: Section[]
  scriptureSlug: string
}

function getFilteredSections(sections: Section[], paths: number[][]): Section[] {
  if (!paths || paths.length === 0) return sections

  // Create a map to track which sections are selected
  const selectedSections = new Map<number, boolean>()
  paths.forEach(path => {
    if (path[0] !== undefined) {
      selectedSections.set(path[0], true)
    }
  })

  // If no sections are selected, return all sections
  if (selectedSections.size === 0) return sections

  // Filter and return only the selected sections
  return sections
    .filter((_, index) => selectedSections.has(index))
    .map(section => {
      const relevantPaths = paths.filter(path => path[0] === sections.indexOf(section))
      const subPaths = relevantPaths.map(path => path.slice(1)).filter(path => path.length > 0)

      return {
        ...section,
        sections: section.sections && subPaths.length > 0
          ? getFilteredSections(section.sections, subPaths)
          : section.sections
      }
    })
}

// Calculate absolute verse number based on the verse's position in the scripture
function calculateAbsoluteVerseNumber(sections: Section[], targetVerse: NonNullable<Section["verses"]>[number]): number {
  let absoluteCount = 0
  let found = false
  let result = 0

  function processSection(section: Section) {
    if (found) return

    if (section.verses) {
      for (const verse of section.verses) {
        absoluteCount++
        if (verse === targetVerse) {
          result = absoluteCount
          found = true
          return
        }
      }
    }

    if (section.sections) {
      section.sections.forEach(processSection)
    }
  }

  sections.forEach(processSection)
  return result
}

function renderVerse(
  verse: NonNullable<Section["verses"]>[number], 
  scriptureSlug: string, 
  displayMode: TextDisplayMode,
  allSections: Section[]
) {
  const absoluteVerseNumber = calculateAbsoluteVerseNumber(allSections, verse)
  const text = displayMode === 'original' ? verse.original_text : (verse.iast_text || "")
  
  return (
    <div key={verse.verse_number} className="p-3 sm:p-4 rounded-lg bg-background border hover:bg-muted/5 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
        <div className="flex-1 w-full">
          <div className="text-foreground whitespace-pre-wrap break-words">
            <ScriptText text={text} isTransliteration={displayMode === 'romanized'} />
          </div>
        </div>
        <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto">
          <Link href={`/scripture/${scriptureSlug}/verse/${absoluteVerseNumber}`}>
            View Verse
          </Link>
        </Button>
      </div>
    </div>
  )
}

function renderSection(
  section: Section, 
  level: number = 1, 
  scriptureSlug: string,
  displayMode: TextDisplayMode,
  allSections: Section[]
) {
  const headingClass = level === 1 
    ? "text-xl sm:text-2xl font-bold mb-4" 
    : level === 2 
      ? "text-lg sm:text-xl font-semibold mb-3" 
      : "text-base sm:text-lg font-medium mb-2"

  return (
    <div key={section.number} className="mb-6 sm:mb-8">
      <h2 className={headingClass}>{section.title}</h2>
      
      {section.verses && section.verses.length > 0 && (
        <div className="space-y-3 sm:space-y-4 mb-6">
          {section.verses.map((verse) => renderVerse(verse, scriptureSlug, displayMode, allSections))}
        </div>
      )}
      
      {section.sections && section.sections.length > 0 && (
        <div className="pl-4 border-l space-y-4 sm:space-y-6">
          {section.sections.map((subsection) => 
            renderSection(subsection, level + 1, scriptureSlug, displayMode, allSections)
          )}
        </div>
      )}
    </div>
  )
}

export default function ScriptureContent({ sections, scriptureSlug }: ScriptureContentProps) {
  const [displayMode, setDisplayMode] = useState<TextDisplayMode>('original')
  const [selectedPaths, setSelectedPaths] = useState<number[][]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Initialize with first chapter after mounting
    setSelectedPaths([[0]])
  }, [])

  const filteredSections = getFilteredSections(sections, selectedPaths)

  if (!mounted) {
    return (
      <div className="relative space-y-4 sm:space-y-6">
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Filter Content</h3>
                <SectionFilter
                  sections={sections}
                  selectedPaths={[[0]]}
                  onPathsChange={() => {}}
                />
              </div>
              <div className="w-full sm:w-[200px]">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Display Mode</h3>
                <Select value="original" onValueChange={() => {}}>
                  <SelectTrigger className="w-full bg-background text-base">
                    <SelectValue placeholder="Select text display" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original" className="text-base">Original Text</SelectItem>
                    <SelectItem value="romanized" className="text-base">Romanized Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="space-y-6 sm:space-y-8">
          {sections.map((section) => renderSection(section, 1, scriptureSlug, 'original', sections))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-4 sm:space-y-6">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Filter Content</h3>
              <SectionFilter
                sections={sections}
                selectedPaths={selectedPaths}
                onPathsChange={setSelectedPaths}
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Display Mode</h3>
              <Select value={displayMode} onValueChange={(value) => setDisplayMode(value as TextDisplayMode)}>
                <SelectTrigger className="w-full bg-background text-base">
                  <SelectValue placeholder="Select text display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original" className="text-base">Original Text</SelectItem>
                  <SelectItem value="romanized" className="text-base">Romanized Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="space-y-6 sm:space-y-8">
        {filteredSections.map((section) => renderSection(section, 1, scriptureSlug, displayMode, sections))}
      </div>
    </div>
  )
} 