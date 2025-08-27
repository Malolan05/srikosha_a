"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { Category } from "@/lib/types"

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", {
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }
    loadCategories()
  }, [])

  return (
    <footer className="border-t bg-muted/40">
      <div className="container px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Śrīkoṣa</h3>
            <p className="text-sm text-muted-foreground">
              A digital repository of the sacred texts of the Śrī Vaiṣṇava Sampradāya.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Categories</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <ul className="space-y-2">
                {categories.slice(0, Math.ceil(categories.length / 2)).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${category.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {categories.slice(Math.ceil(categories.length / 2)).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${category.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Bibliography
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground mb-2">
              For questions, suggestions, or contributions, please reach out to us.
            </p>
            <Link
              href="mailto:contact@srikosha.org"
              className="text-sm text-primary hover:underline inline-block"
            >
              contact@srikosha.org
            </Link>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">© {new Date().getFullYear()} Śrīkoṣa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

