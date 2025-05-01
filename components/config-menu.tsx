"use client"

import { useState } from "react"
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
}: ConfigMenuProps) {
  const [isPatternEditorOpen, setIsPatternEditorOpen] = useState(false)

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
