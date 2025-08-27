import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Category } from "@/lib/types"

export async function GET() {
  try {
    const categoriesPath = path.join(process.cwd(), "data/categories.json")
    const categoriesData = await fs.readFile(categoriesPath, "utf-8")
    const categories = JSON.parse(categoriesData) as Category[]
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error loading categories:", error)
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 })
  }
} 