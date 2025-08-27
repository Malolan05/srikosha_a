import fs from "fs"
import path from "path"

export interface ScriptureMetadata {
  slug: string
  scripture_name: string
  category: string
  author: string
  language: string
  script: string
  total_verses: number
}

export interface Verse {
  original_text: string
  iast_text: string
  english_translation: string
  commentaries: Record<string, string>
}

export interface Section {
  title: string
  verses?: Verse[]
  sections?: Section[]
}

export interface Scripture {
  metadata: ScriptureMetadata
  content: {
    sections: Section[]
  }
}

// Cache for loaded scriptures
let scriptureCache: Scripture[] | null = null

// Load all scriptures
export async function scriptures(): Promise<Scripture[]> {
  if (scriptureCache) {
    return scriptureCache
  }

  const response = await fetch('/api/scriptures')
  if (!response.ok) {
    throw new Error('Failed to fetch scriptures')
  }

  const data = await response.json()
  scriptureCache = data
  return data
}

// Get scripture content by slug
export async function getScriptureContent(scriptureSlug: string): Promise<Scripture | null> {
  const response = await fetch(`/api/scriptures/${scriptureSlug}`)
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('Failed to fetch scripture content')
  }

  return response.json()
} 