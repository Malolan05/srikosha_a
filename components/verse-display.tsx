"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VerseDisplayProps {
  verse: {
    original: string
    transliteration: string
    translation: string
  }
}

export default function VerseDisplay({ verse }: VerseDisplayProps) {
  const hasTranslation = Boolean(verse.translation && verse.translation.trim().length > 0)

  return (
    <Tabs defaultValue="original" className="w-full">
      <TabsList className="w-full mb-3 sm:mb-4">
        <TabsTrigger value="original" className="flex-1 text-sm sm:text-base">Original</TabsTrigger>
        <TabsTrigger value="transliteration" className="flex-1 text-sm sm:text-base">Transliteration</TabsTrigger>
        {hasTranslation && (
          <TabsTrigger value="translation" className="flex-1 text-sm sm:text-base">Translation</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="original">
        <div className="text-xl sm:text-2xl text-center leading-relaxed font-tamil">
          <div className="break-words whitespace-pre-wrap px-2">
            {verse.original}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="transliteration">
        <div className="text-xl sm:text-2xl text-center leading-relaxed">
          <div className="break-words whitespace-pre-wrap px-2">
            {verse.transliteration}
          </div>
        </div>
      </TabsContent>
      {hasTranslation && (
        <TabsContent value="translation">
          <div className="text-lg sm:text-xl text-center leading-relaxed">
            <div className="break-words whitespace-pre-wrap px-2">
              {verse.translation}
            </div>
          </div>
        </TabsContent>
      )}
    </Tabs>
  )
}

