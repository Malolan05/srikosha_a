import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import type { Scripture } from '@/lib/data'

export async function GET() {
  try {
    const scripturePath = path.join(process.cwd(), 'data', 'scriptures')
    const files = await fs.readdir(scripturePath)
    const scriptureFiles = files.filter(file => file.endsWith('.json'))

    const scriptures = await Promise.all(
      scriptureFiles.map(async file => {
        const filePath = path.join(scripturePath, file)
        const content = await fs.readFile(filePath, 'utf8')
        return JSON.parse(content) as Scripture
      })
    )

    return NextResponse.json(scriptures)
  } catch (error) {
    console.error('Error loading scriptures:', error)
    return new NextResponse('Error loading scriptures', { status: 500 })
  }
} 