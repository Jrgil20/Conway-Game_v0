"use client"

import { Play, Pause, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfigMenu } from "./config-menu"

type GameControlsProps = {
  isRunning: boolean
  toggleRunning: () => void
  nextGeneration: () => void
  generation: number
  speed: number
  setSpeed: (speed: number) => void
  selectedPatternName: string
  clearSelectedPattern: () => void
}

export function GameControls({
  isRunning,
  toggleRunning,
  nextGeneration,
  generation,
  speed,
  setSpeed,
  selectedPatternName,
  clearSelectedPattern,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={toggleRunning} variant="outline" className="flex items-center gap-2">
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Pausar" : "Iniciar"}
        </Button>

        <Button onClick={nextGeneration} variant="outline" disabled={isRunning} className="flex items-center gap-2">
          <SkipForward className="h-4 w-4" />
          Paso
        </Button>

        <ConfigMenu isRunning={isRunning} />
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <span className="text-sm">Velocidad:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSpeed(Math.min(speed + 50, 500))}
            disabled={isRunning || speed >= 500}
          >
            -
          </Button>
          <input
            type="number"
            className="w-16 h-8 px-2 border rounded text-center"
            value={Math.round(1000 / speed)}
            onChange={(e) => {
              const genPerSec = Number.parseInt(e.target.value, 10)
              if (!isNaN(genPerSec) && genPerSec > 0 && genPerSec <= 20) {
                setSpeed(Math.round(1000 / genPerSec))
              }
            }}
            min="1"
            max="20"
            disabled={isRunning}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSpeed(Math.max(speed - 50, 50))}
            disabled={isRunning || speed <= 50}
          >
            +
          </Button>
          <span className="text-sm">gen/seg</span>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center">
        <span className="text-sm">Generación: {generation}</span>
        {selectedPatternName && (
          <div className="flex items-center gap-2">
            <span className="text-sm bg-blue-100 px-2 py-1 rounded-md">Patrón seleccionado: {selectedPatternName}</span>
            <Button variant="outline" size="sm" onClick={clearSelectedPattern} className="h-7 px-2">
              ✕
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
