"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Search, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Category } from "@/lib/types"
import categories from "@/data/categories.json"
import { SearchCommand, useSearchCommand } from "@/components/search-command"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { open: searchOpen, setOpen: setSearchOpen } = useSearchCommand()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-soft">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center group">
          <span className="font-bold text-xl text-gradient transition-transform group-hover:scale-105">
            Śrīkoṣa
          </span>
        </Link>

        <Button
          variant="outline"
          className="flex-1 max-w-md mx-4 justify-start text-muted-foreground border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search scriptures...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative hover:bg-accent/50 transition-colors"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-warm bg-popover border border-border/50 backdrop-blur-sm">
                <nav className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/${category.slug}`}
                      className={`block px-4 py-3 hover:bg-muted/50 transition-colors rounded-lg mx-2 ${
                        pathname.startsWith(`/${category.slug}`)
                          ? "bg-muted text-primary"
                          : ""
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="font-medium">{category.name}</div>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

