import CategoryGrid from "@/components/category-grid"
import categories from "@/data/categories.json"

export default function Home() {
  return (
    <div className="gradient-bg min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col">
        <div className="mb-12 sm:mb-16 text-center">
          <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Śrīkoṣa
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore the sacred texts of the Śrī Vaiṣṇava Sampradāya
          </p>
        </div>

        <div className="flex-1">
          <CategoryGrid categories={categories} />
        </div>
      </div>
    </div>
  )
}