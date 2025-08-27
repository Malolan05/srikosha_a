import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Category, Scripture } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Import all scripture files
import sriParameshvaraSamhita from '@/data/scriptures/sri-parameshvara-samhita.json'
import gitarthasangraha from '@/data/scriptures/gitarthasangraha.json'
import brahmaSutraAdhyayaOne from '@/data/scriptures/brahma-sutra-adhyaya-one.json'
import brahmaSutraAdhyayaTwo from '@/data/scriptures/brahma-sutra-adhyaya-two.json'
import brahmaSutraAdhyayaThree from '@/data/scriptures/brahma-sutra-adhyaya-three.json'
import brahmaSutraAdhyayaFour from '@/data/scriptures/brahma-sutra-adhyaya-four.json'
import purushakaramimamsa from '@/data/scriptures/purushakara-mimamsa.json'
import stotraratna from '@/data/scriptures/stotraratna.json'
import vedarthasangraha from '@/data/scriptures/vedarthasangraha.json'
import natvachandrikapramukhacapetika from '@/data/scriptures/natvacandrika-pramukhacapetika.json'
import rahasyatrayasararthasangraha from '@/data/scriptures/rahasyatrayasararthasangraha.json'
import rahasyatrayasara from '@/data/scriptures/rahasyatrayasara.json'
import mimamsaparibasha from '@/data/scriptures/mimamsa-paribasha.json'
import shatadushani from '@/data/scriptures/shatadushani.json'
import agamapramanyam from "@/data/scriptures/agama-pramanyam.json"
import vishvaksenasamhita from "@/data/scriptures/sri-vishvaksena-samhita.json"
import vishnusamhita from "@/data/scriptures/vishnu-samhita.json"
import paushkarasamhita from "@/data/scriptures/paushkara-samhita.json"
import lakshmitantram from "@/data/scriptures/lakshmi-tantram.json"
import aniruddhasamhita from "@/data/scriptures/aniruddha-samhita.json"
import paramapurushasamhita from "@/data/scriptures/paramapurusha-samhita.json"
import sriprashnasamhita from "@/data/scriptures/sriprashna-samhita.json"
import tattvamuktakalapam from "@/data/scriptures/tattvamuktakalapam.json"
import upanishadone from "@/data/scriptures/upanishad-one.json"
import kathopanishad from "@/data/scriptures/katha-upanishad.json"
import chandogyopanishad from "@/data/scriptures/chandogya-upanishad.json"
import taittiriyopanishad from "@/data/scriptures/taittiriya-upanishad.json"
import shvetasvataropanishad from "@/data/scriptures/shvetasvatara-upanishad.json"
// Create a map of all scriptures
const scripturesData: Scripture[] = [
  agamapramanyam,
  sriParameshvaraSamhita,
  paushkarasamhita,
  lakshmitantram,
  sriprashnasamhita,
  aniruddhasamhita,
  paramapurushasamhita,
  vishnusamhita,
  vishvaksenasamhita,
  brahmaSutraAdhyayaOne,
  brahmaSutraAdhyayaTwo,
  brahmaSutraAdhyayaThree,
  brahmaSutraAdhyayaFour,
  upanishadone,
  kathopanishad,
  chandogyopanishad,
  taittiriyopanishad,
  shvetasvataropanishad,
  tattvamuktakalapam,
  gitarthasangraha,
  stotraratna,
  vedarthasangraha,
  natvachandrikapramukhacapetika,
  rahasyatrayasara,
  rahasyatrayasararthasangraha,
  purushakaramimamsa,
  mimamsaparibasha,
  shatadushani
]

export function getScriptType(text: string): 'devanagari' | 'tamil' | 'latin' | 'mixed' {
  // Devanagari Unicode range: 0900-097F
  const devanagariPattern = /[\u0900-\u097F]/
  // Tamil Unicode range: 0B80-0BFF
  const tamilPattern = /[\u0B80-\u0BFF]/

  const hasDevanagari = devanagariPattern.test(text)
  const hasTamil = tamilPattern.test(text)

  if (hasDevanagari && hasTamil) return 'mixed'
  if (hasDevanagari) return 'devanagari'
  if (hasTamil) return 'tamil'
  return 'latin'
}

export async function getScripture(slug: string): Promise<Scripture | null> {
  const scripture = scripturesData.find(s => s.metadata.slug === slug)
  return scripture || null
}

export async function getAllScriptures(): Promise<Scripture[]> {
  return scripturesData
}

export async function getScripturesByCategory(category: string): Promise<Scripture[]> {
  return scripturesData.filter(scripture => scripture.metadata.category === category)
}

