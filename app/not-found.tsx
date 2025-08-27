import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
      <h2 className="text-3xl font-bold tracking-tight mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}

