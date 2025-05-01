"use client"

import { useState, useEffect } from "react"
import { Settings, RefreshCw, Maximize, Minimize, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

type ConfigMenuProps = {
  isRunning: boolean
  gridSize: number
  increaseGridSize: () => void
  decreaseGridSize: () => void
  randomizeGrid: () => void
  initializeGrid: () => void
  showPatterns: boolean
  setShowPatterns: (show: boolean) => void
  addCustomPattern?: (pattern: number[][], name: string) => void
  speed: number
  setSpeed: (speed: number) => void
}

export function ConfigMenu({
  isRunning,
  gridSize,
  increaseGridSize,
  decreaseGridSize,
  randomizeGrid,
  initializeGrid,
  showPatterns,
  setShowPatterns,
  addCustomPattern,
  speed,
  setSpeed,
}: ConfigMenuProps) {
  const [isPatternEditorOpen, setIsPatternEditorOpen] = useState(false)
  const [speedInput, setSpeedInput] = useState<string>(Math.round(1000 / speed).toString())

  const openPatternEditor = () => {
    setIsPatternEditorOpen(true)
  }

  const closePatternEditor = () => {
    setIsPatternEditorOpen(false)
  }

  const saveCustomPattern = (pattern: number[][], name: string) => {
    if (addCustomPattern) {
      addCustomPattern(pattern, name)
    } else if (window.addCustomPattern) {
      window.addCustomPattern(pattern, name)
    }
    closePatternEditor()
  }

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeedInput(e.target.value)
  }

  const handleSpeedBlur = () => {
    const genPerSec = parseInt(speedInput, 10);
    if (!isNaN(genPerSec) && genPerSec > 0) {
      const newSpeed = Math.round(1000 / genPerSec);
      if (newSpeed >= 50 && newSpeed <= 500) {
        setSpeed(newSpeed);
      } else if (newSpeed < 50) {
        setSpeed(50);
        setSpeedInput("20"); // 1000/50 = 20 gen/seg
      } else {
        setSpeed(500);
        setSpeedInput("2"); // 1000/500 = 2 gen/seg
      }
    } else {
      setSpeedInput(Math.round(1000 / speed).toString());
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSpeedBlur();
    }
  }
  
  // Actualizar el campo de entrada cuando cambie la velocidad del juego
  useEffect(() => {
    setSpeedInput(Math.round(1000 / speed).toString());
  }, [speed]);

  return (
    <>
      {/* Botón de Acciones */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isRunning} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Acciones
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Acciones del Juego</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={randomizeGrid} disabled={isRunning}>
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Aleatorio</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={initializeGrid} disabled={isRunning}>
              <Play className="mr-2 h-4 w-4 rotate-90" />
              <span>Limpiar Tablero</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => setShowPatterns(!showPatterns)}>
              <ChevronRight className="mr-2 h-4 w-4" />
              <span>{showPatterns ? "Ocultar Patrones" : "Mostrar Patrones"}</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={openPatternEditor} disabled={isRunning}>
              <span className="mr-2">✏️</span>
              <span>Crear Patrón Personalizado</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Botón de Configuración */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isRunning} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Configuración del Juego</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Maximize className="mr-2 h-4 w-4" />
                <span>Tamaño del Tablero</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={increaseGridSize} disabled={isRunning || gridSize >= 50}>
                    <Maximize className="mr-2 h-4 w-4" />
                    <span>Más grande</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={decreaseGridSize} disabled={isRunning || gridSize <= 10}>
                    <Minimize className="mr-2 h-4 w-4" />
                    <span>Más pequeño</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <span>
                      Tamaño actual: {gridSize}x{gridSize}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="mr-2">⏱️</span>
                <span>Velocidad</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem 
                    onClick={() => setSpeed(Math.min(speed + 50, 500))} 
                    disabled={isRunning || speed >= 500}
                  >
                    <span className="mr-2">🐢</span>
                    <span>Más lento</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSpeed(Math.max(speed - 50, 50))} 
                    disabled={isRunning || speed <= 50}
                  >
                    <span className="mr-2">🐇</span>
                    <span>Más rápido</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Velocidad actual:</span>
                      <span className="font-medium">{Math.round(1000 / speed)} gen/seg</span>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="speed-input" className="block text-xs mb-1">Velocidad (gen/seg):</label>
                      <input
                        id="speed-input"
                        type="number"
                        min="2"
                        max="20"
                        className="w-full px-2 py-1 border rounded text-sm"
                        value={speedInput}
                        onChange={handleSpeedChange}
                        onBlur={handleSpeedBlur}
                        onKeyDown={handleKeyDown}
                        disabled={isRunning}
                      />
                    </div>
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {isPatternEditorOpen && <PatternEditor onClose={closePatternEditor} onSave={saveCustomPattern} />}
    </>
  )
}

// Define the PatternEditor component
type PatternEditorProps = {
  onClose: () => void
  onSave: (pattern: number[][], name: string) => void
}

function PatternEditor({ onClose, onSave }: PatternEditorProps) {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(false)),
  )
  const [patternName, setPatternName] = useState("Mi Patrón")

  const toggleCell = (row: number, col: number) => {
    const newGrid = [...grid]
    newGrid[row][col] = !newGrid[row][col]
    setGrid(newGrid)
  }

  const clearGrid = () => {
    setGrid(
      Array(10)
        .fill(null)
        .map(() => Array(10).fill(false)),
    )
  }

  const handleSave = () => {
    // Find the bounds of the pattern
    let minRow = 10,
      minCol = 10,
      maxRow = 0,
      maxCol = 0
    let hasActiveCells = false

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (grid[i][j]) {
          hasActiveCells = true
          minRow = Math.min(minRow, i)
          minCol = Math.min(minCol, j)
          maxRow = Math.max(maxRow, i)
          maxCol = Math.max(maxCol, j)
        }
      }
    }

    if (!hasActiveCells) {
      alert("El patrón está vacío. Dibuja algo primero.")
      return
    }

    // Extract the pattern
    const pattern: number[][] = []
    for (let i = minRow; i <= maxRow; i++) {
      const row: number[] = []
      for (let j = minCol; j <= maxCol; j++) {
        row.push(grid[i][j] ? 1 : 0)
      }
      pattern.push(row)
    }

    onSave(pattern, patternName || "Patrón Personalizado")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Crear Patrón Personalizado</h2>

        <div className="mb-4">
          <label htmlFor="pattern-name" className="block text-sm font-medium mb-1">
            Nombre del Patrón
          </label>
          <input
            id="pattern-name"
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={patternName}
            onChange={(e) => setPatternName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm mb-2">Dibuja tu patrón (haz clic para activar/desactivar celdas):</p>
          <div className="grid grid-cols-10 gap-1 mx-auto w-fit bg-gray-100 p-2 rounded">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-6 h-6 border cursor-pointer transition-colors ${
                    cell ? "bg-black" : "bg-white hover:bg-gray-200"
                  }`}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                />
              )),
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={clearGrid}>
            Limpiar
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add type definition for the global function
declare global {
  interface Window {
    addCustomPattern?: (pattern: number[][], name: string) => void
  }
}
