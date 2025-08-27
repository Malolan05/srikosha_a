import CategoryGrid from "@/components/category-grid"
import categories from "@/data/categories.json"

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8 sm:mb-12 text-left sm:text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-primary">Śrīkoṣa</h1>
        <p className="text-base sm:text-lg text-muted-foreground">Explore the sacred texts of the Śrī Vaiṣṇava Sampradāya</p>
      </div>

      <div className="flex-1">
        <CategoryGrid categories={categories} />
      </div>
    </div>
  )
}