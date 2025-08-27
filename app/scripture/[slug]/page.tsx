import { notFound } from "next/navigation"
import { getAllScriptures, getScripture } from "@/lib/utils"
import type { Metadata } from "next"
import ScriptureContent from "@/components/scripture-content"

interface ScripturePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const scriptures = await getAllScriptures()
  return scriptures.map((scripture) => ({
    slug: scripture.metadata.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const scripture = await getScripture(params.slug)

  if (!scripture) {
    return {
      title: "Scripture Not Found",
      description: "The requested scripture could not be found.",
    }
  }

  return {
    title: `${scripture.metadata.scripture_name} - Śrīkoṣa`,
    description: `${scripture.metadata.scripture_name} by ${scripture.metadata.author}, composed in ${scripture.metadata.year_of_composition}.`,
  }
}

export default async function ScripturePage({ params }: ScripturePageProps) {
  const scripture = await getScripture(params.slug)

  if (!scripture) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-primary">
          {scripture.metadata.scripture_name}
        </h1>
        <div className="text-lg text-muted-foreground space-y-2">
          <p>By {scripture.metadata.author}</p>
          <p>Composed in {scripture.metadata.year_of_composition}</p>
          <p>{scripture.metadata.total_chapters} {scripture.metadata.total_chapters === 1 ? 'chapter' : 'chapters'} • {scripture.metadata.total_verses} verses</p>
        </div>
      </div>

      <div className="flex-1">
        <ScriptureContent 
          sections={scripture.content.sections} 
          scriptureSlug={scripture.metadata.slug}
        />
      </div>
    </div>
  )
} 