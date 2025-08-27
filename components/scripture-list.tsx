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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {scriptures.map((scripture) => {
        const { scripture_name, slug } = scripture.metadata
        console.log('ScriptureList - Processing scripture:')
        console.log('- Name:', scripture_name)
        console.log('- Slug:', slug)
        console.log('- Link path:', `/scripture/${slug}`)
        return (
          <Card key={slug} className="overflow-hidden group flex flex-col">
            <CardHeader className="pb-3 flex-none">
              <CardTitle className="text-lg sm:text-xl">{scripture_name}</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                By {scripture.metadata.author}, {scripture.metadata.year_of_composition}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  {scripture.metadata.total_chapters} chapters
                </p>
                <p className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4" />
                  {scripture.metadata.total_verses} verses
                </p>
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
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

