"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Section as ScriptureSection } from "@/lib/types"

interface SectionFilterProps {
  sections: ScriptureSection[]
  selectedPaths: number[][]
  onPathsChange: (paths: number[][]) => void
  level?: number
}

export function SectionFilter({ sections, selectedPaths, onPathsChange, level = 0 }: SectionFilterProps) {
  // Get all selections at this level
  const currentSelections = selectedPaths
    .map(path => path[level])
    .filter(selection => selection !== undefined)
  
  const hasSubsections = sections.some(section => section.sections && section.sections.length > 0)

  const handleSelectionChange = (value: string) => {
    if (value === "all") {
      // If "all" is selected, create paths for all sections at this level
      const newPaths = sections.map((_, index) => [index])
      onPathsChange(newPaths)
      return
    }

    const newValue = parseInt(value)
    
    // Toggle selection
    if (currentSelections.includes(newValue)) {
      // Calculate remaining paths before the filter
      const newPaths = selectedPaths.filter(path => path[level] !== newValue)
      
      // Only prevent unselecting if this would leave us with no selections
      if (level === 0 && newPaths.length === 0) {
        return
      }
      
      // Apply the change
      onPathsChange(newPaths)
    } else {
      // Add this selection
      const newPath = Array(level).fill(0)
      newPath.push(newValue)
      onPathsChange([...selectedPaths, newPath])
    }
  }

  // Get all selected sections at this level
  const selectedSections = currentSelections
    .filter(selection => selection !== undefined && selection >= 0)
    .map(selection => sections[selection])
    .filter(Boolean)

  // Calculate the display value for the trigger
  const displayValue = currentSelections.length > 0
    ? currentSelections.length === sections.length
      ? "All Chapters"
      : `${currentSelections.length} selected`
    : `Select ${level === 0 ? "Chapter" : "Section"}`

  return (
    <div className="space-y-2">
      <Select
        value={currentSelections.length === sections.length ? "all" : "default"}
        onValueChange={handleSelectionChange}
      >
        <SelectTrigger className="w-full bg-background text-base">
          <SelectValue>{displayValue}</SelectValue>
        </SelectTrigger>
        <SelectContent position="item-aligned" side="bottom" align="start" className="max-h-[300px]">
          <SelectItem value="all" className="text-base">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${currentSelections.length === sections.length ? 'bg-primary' : 'bg-muted'}`} />
              All {level === 0 ? "Chapters" : "Sections"}
            </div>
          </SelectItem>
          {sections.map((section, index) => (
            <SelectItem key={section.number} value={index.toString()} className="text-base">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentSelections.includes(index) ? 'bg-primary' : 'bg-muted'}`} />
                {section.title}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Only show next level if we have specific sections selected (not "all") */}
      {hasSubsections && selectedSections.length > 0 && selectedSections.some(section => section.sections && section.sections.length > 0) && (
        <div className="pl-4 border-l border-border">
          {selectedSections.map((section, index) => (
            section.sections && section.sections.length > 0 && (
              <SectionFilter
                key={section.number}
                sections={section.sections}
                selectedPaths={selectedPaths}
                onPathsChange={onPathsChange}
                level={level + 1}
              />
            )
          ))}
        </div>
      )}
    </div>
  )
} 