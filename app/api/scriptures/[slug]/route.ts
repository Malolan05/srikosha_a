import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Scripture } from "@/lib/types"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Get all scripture files
    const scripturesDir = path.join(process.cwd(), "data/scriptures")
    const files = await fs.readdir(scripturesDir)
    
    console.log('Requested slug:', params.slug)
    console.log('Available files:', files)
    
    // Find the file that matches our slug pattern
    let matchingFile = null
    for (const file of files) {
      // Read the file to get the actual scripture name
      const scriptureData = await fs.readFile(path.join(scripturesDir, file), "utf-8")
      const scripture = JSON.parse(scriptureData) as Scripture
      console.log('Comparing metadata slug:', scripture.metadata.slug, 'with requested:', params.slug)
      if (scripture.metadata.slug === params.slug) {
        matchingFile = file
        break
      }
    }

    if (!matchingFile) {
      console.log('No matching file found')
      return NextResponse.json({ error: "Scripture not found" }, { status: 404 })
    }

    const scriptureData = await fs.readFile(path.join(scripturesDir, matchingFile), "utf-8")
    const scripture = JSON.parse(scriptureData) as Scripture
    
    return NextResponse.json(scripture)
  } catch (error) {
    console.error(`Error loading scripture ${params.slug}:`, error)
    return NextResponse.json({ error: "Scripture not found" }, { status: 404 })
  }
} 