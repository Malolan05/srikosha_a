export interface Category {
  name: string
  slug: string
  description: string
  longDescription?: string
}

export interface Scripture {
  metadata: ScriptureMetadata
  content: {
    title: string
    sections: Section[]
  }
}

export interface Commentary {
  author: string
  commentary: string
}

export interface Verse {
  verse_number: number
  original_text: string
  iast_text?: string
  english_translation?: string | null
  commentaries: Commentary[]
}

export interface Section {
  title: string
  number: number | string
  verses?: Verse[]
  sections?: Section[]
}

export interface ScriptureMetadata {
  scripture_name: string
  slug: string
  author: string
  year_of_composition: string
  category: string
  total_chapters: number
  total_verses: number
}

// For managing text display preferences
export type TextDisplayMode = 'original' | 'romanized'

export interface WordMeaning {
  word: string
  meaning: string
}

export interface ScriptureContent {
  id: string
  title: string
  verses: Verse[]
}

