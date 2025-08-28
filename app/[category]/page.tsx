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
    <div className="gradient-bg min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col">
        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
            {category.name}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="flex-1">
          <ScriptureList scriptures={scriptures} />
        </div>
      </div>
    </div>
  )
}

