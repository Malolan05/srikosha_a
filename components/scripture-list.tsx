import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Book, ScrollText } from "lucide-react"
import type { Scripture } from "@/lib/types"

interface ScriptureListProps {
  scriptures: Scripture[]
}

export default function ScriptureList({ scriptures }: ScriptureListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {scriptures.map((scripture) => {
        const { scripture_name, slug } = scripture.metadata
        console.log('ScriptureList - Processing scripture:')
        console.log('- Name:', scripture_name)
        console.log('- Slug:', slug)
        console.log('- Link path:', `/scripture/${slug}`)
        return (
          <Card key={slug} className="category-card overflow-hidden group flex flex-col h-full">
            <CardHeader className="pb-4 flex-none">
              <CardTitle className="category-title text-xl sm:text-2xl font-bold">{scripture_name}</CardTitle>
              <CardDescription className="text-base sm:text-lg text-muted-foreground">
                By {scripture.metadata.author}, {scripture.metadata.year_of_composition}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="text-sm text-muted-foreground space-y-3">
                <p className="flex items-center gap-2 bg-muted/30 rounded-lg p-3">
                  <Book className="h-4 w-4 text-primary" />
                  <span className="font-medium">{scripture.metadata.total_chapters} chapters</span>
                </p>
                <p className="flex items-center gap-2 bg-muted/30 rounded-lg p-3">
                  <ScrollText className="h-4 w-4 text-primary" />
                  <span className="font-medium">{scripture.metadata.total_verses} verses</span>
                </p>
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button asChild className="btn-primary w-full rounded-lg py-3 text-sm font-semibold">
                <Link href={`/scripture/${slug}`}>
                  <span>Read Scripture</span>
                </Link>
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

