import { notFound } from "next/navigation"
import { getScripturesByCategory } from "@/lib/utils"
import ScriptureList from "@/components/scripture-list"
import type { Metadata } from "next"
import categories from "@/data/categories.json"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }))
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = categories.find((c) => c.slug === params.category)

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    }
  }

  return {
    title: `${category.name} - Śrīkoṣa`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find((c) => c.slug === params.category)
  
  if (!category) {
    notFound()
  }

  const scriptures = await getScripturesByCategory(category.name)

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-primary">{category.name}</h1>
        <p className="text-base sm:text-lg text-muted-foreground">{category.description}</p>
      </div>

      <div className="flex-1">
        <ScriptureList scriptures={scriptures} />
      </div>
    </div>
  )
}

