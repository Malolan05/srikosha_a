"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { Category } from "@/lib/types"

interface CategoryGridProps {
  categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {categories.map((category) => (
        <Card key={category.slug} className="category-card overflow-hidden group flex flex-col h-full">
          <CardHeader className="pb-4 text-left flex-none">
            <CardTitle className="category-title text-xl sm:text-2xl font-bold">{category.name}</CardTitle>
            <CardDescription className="text-base sm:text-lg line-clamp-2 text-muted-foreground">
              {category.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <CategoryImage slug={category.slug} name={category.name} />
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {category.longDescription}
            </p>
          </CardContent>
          <CardFooter className="mt-auto pt-6">
            <Button asChild className="btn-primary w-full rounded-lg py-3 text-sm font-semibold">
              <Link href={`/${category.slug}`}>
                <span>Explore {category.name}</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function CategoryImage({ slug, name }: { slug: string, name: string }) {
  const [imgError, setImgError] = useState(false)
  const imgSrc = `/categories/${slug}/${slug}.jpg`
  const placeholder = "/placeholder.svg?height=200&width=300"
  return (
    <div className="h-40 sm:h-48 rounded-xl bg-muted/60 mb-4 overflow-hidden flex items-center justify-center shadow-soft border border-border/50">
      <img
        src={imgError ? placeholder : imgSrc}
        alt={name}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        onError={() => setImgError(true)}
      />
    </div>
  )
}
