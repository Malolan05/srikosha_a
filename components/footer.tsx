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
    <footer className="border-t border-border/50 bg-muted/20 backdrop-blur-sm">
      <div className="container px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gradient">Śrīkoṣa</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A digital repository of the sacred texts of the Śrī Vaiṣṇava Sampradāya.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Categories</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <ul className="space-y-3">
                {categories.slice(0, Math.ceil(categories.length / 2)).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${category.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {categories.slice(Math.ceil(categories.length / 2)).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${category.slug}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline">
                  Bibliography
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Contact</h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              For questions, suggestions, or contributions, please reach out to us.
            </p>
            <Link
              href="mailto:contact@srikosha.org"
              className="text-sm text-primary hover:underline inline-block font-medium"
            >
              contact@srikosha.org
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Śrīkoṣa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

