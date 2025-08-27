import { getScriptType } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface ScriptTextProps {
  text: string
  className?: string
  isTransliteration?: boolean
}

export default function ScriptText({ text, className, isTransliteration = false }: ScriptTextProps) {
  const scriptType = getScriptType(text)
  
  // Split text into lines and render each line separately
  const lines = text.split('\n')
  
  return (
    <div
      className={cn(
        "whitespace-pre-wrap",
        isTransliteration && "font-transliteration",
        !isTransliteration && scriptType === "devanagari" && "font-sanskrit",
        scriptType === "tamil" && "font-tamil",
        scriptType === "mixed" && "font-mixed",
        className
      )}
    >
      {lines.map((line, index) => (
        <div key={index} className="min-h-[1.5em]">
          {line}
        </div>
      ))}
    </div>
  )
} 