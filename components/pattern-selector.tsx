"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { gamePatterns, type PatternCategory, type Pattern } from "@/lib/game-patterns"

type PatternSelectorProps = {
  onSelectPattern: (pattern: number[][], name: string) => void
  selectedPatternName: string
  customPatterns?: Array<{ name: string; pattern: number[][] }>
}

export function PatternSelector({ onSelectPattern, selectedPatternName, customPatterns = [] }: PatternSelectorProps) {
  const hasCustomPatterns = customPatterns.length > 0

  return (
    <div className="w-48 border border-gray-300 rounded-md p-2 bg-white">
      <Tabs defaultValue="stillLifes">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="stillLifes">Estáticos</TabsTrigger>
          <TabsTrigger value="oscillators">Osciladores</TabsTrigger>
          <TabsTrigger value="spaceships">Naves</TabsTrigger>
          <TabsTrigger value="generators">Generadores</TabsTrigger>
          {hasCustomPatterns && <TabsTrigger value="custom">Personalizados</TabsTrigger>}
        </TabsList>

        <ScrollArea className="h-[400px]">
          {(Object.keys(gamePatterns) as PatternCategory[]).map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid gap-2">
                {gamePatterns[category].map((pattern, idx) => (
                  <PatternButton
                    key={`${category}-${idx}`}
                    pattern={pattern}
                    onClick={() => onSelectPattern(pattern.pattern, pattern.name)}
                    isSelected={selectedPatternName === pattern.name}
                  />
                ))}
              </div>
            </TabsContent>
          ))}

          {hasCustomPatterns && (
            <TabsContent value="custom" className="mt-0">
              <div className="grid gap-2">
                {customPatterns.map((pattern, idx) => (
                  <PatternButton
                    key={`custom-${idx}`}
                    pattern={pattern}
                    onClick={() => onSelectPattern(pattern.pattern, pattern.name)}
                    isSelected={selectedPatternName === pattern.name}
                  />
                ))}
              </div>
            </TabsContent>
          )}
        </ScrollArea>
      </Tabs>

      <div className="mt-4 text-xs text-gray-500">
        <p>Selecciona un patrón y haz clic en el tablero para colocarlo</p>
      </div>
    </div>
  )
}

type PatternButtonProps = {
  pattern: Pattern
  onClick: () => void
  isSelected: boolean
}

function PatternButton({ pattern, onClick, isSelected }: PatternButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className="w-full h-auto p-2 flex flex-col items-center justify-center gap-1"
      onClick={onClick}
    >
      <div
        className="grid gap-[1px] bg-gray-200"
        style={{
          gridTemplateColumns: `repeat(${pattern.pattern[0].length}, 1fr)`,
        }}
      >
        {pattern.pattern.map((row, i) =>
          row.map((cell, j) => <div key={`${i}-${j}`} className={`w-2 h-2 ${cell ? "bg-black" : "bg-white"}`} />),
        )}
      </div>
      <span className="text-xs">{pattern.name}</span>
    </Button>
  )
}
