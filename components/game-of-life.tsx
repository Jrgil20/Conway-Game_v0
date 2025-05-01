"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { GameProvider } from "@/hooks/use-game-context"
import { GameControls } from "./game-controls"
import { GameGrid } from "./game-grid"
import { PatternSelector } from "./pattern-selector"
import { RulesDialog } from "./rules-dialog"

export default function GameOfLife() {
  // Grid state
  const [gridSize, setGridSize] = useState(25)
  const [grid, setGrid] = useState<boolean[][]>([])

  // Game state
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(200) // ms between generations
  const [generation, setGeneration] = useState(0)
  const [showPatterns, setShowPatterns] = useState(false)

  // Pattern selection
  const [selectedPattern, setSelectedPattern] = useState<number[][]>([])
  const [selectedPatternName, setSelectedPatternName] = useState("")

  // Custom rules
  const [surviveRules, setSurviveRules] = useState([false, false, true, true, false, false, false, false, false])
  const [birthRules, setBirthRules] = useState([false, false, false, true, false, false, false, false, false])

  // Reference for animation loop
  const runningRef = useRef(isRunning)
  runningRef.current = isRunning

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(false))
    setGrid(newGrid)
    setGeneration(0)
  }, [gridSize])

  // Initialize on mount and when grid size changes
  useEffect(() => {
    initializeGrid()
  }, [initializeGrid])

  // Toggle cell state
  const toggleCell = (i: number, j: number) => {
    if (isRunning) return

    if (selectedPattern.length > 0) {
      placePattern(i, j)
      return
    }

    const newGrid = [...grid]
    newGrid[i][j] = !newGrid[i][j]
    setGrid(newGrid)
  }

  // Place a pattern on the grid
  const placePattern = (startI: number, startJ: number) => {
    if (isRunning || selectedPattern.length === 0) return

    const newGrid = [...grid]

    // Calculate offsets to center the pattern
    const patternHeight = selectedPattern.length
    const patternWidth = selectedPattern[0].length

    const offsetI = Math.floor(startI - patternHeight / 2)
    const offsetJ = Math.floor(startJ - patternWidth / 2)

    // Place the pattern
    for (let i = 0; i < patternHeight; i++) {
      for (let j = 0; j < patternWidth; j++) {
        const gridI = offsetI + i
        const gridJ = offsetJ + j

        // Check if within grid bounds
        if (gridI >= 0 && gridI < gridSize && gridJ >= 0 && gridJ < gridSize) {
          newGrid[gridI][gridJ] = selectedPattern[i][j] === 1
        }
      }
    }

    setGrid(newGrid)
  }

  // Select a pattern
  const selectPattern = (pattern: number[][], name: string) => {
    setSelectedPattern(pattern)
    setSelectedPatternName(name)
  }

  // Clear selected pattern
  const clearSelectedPattern = () => {
    setSelectedPattern([])
    setSelectedPatternName("")
  }

  // Count neighbors
  const countNeighbors = (grid: boolean[][], i: number, j: number) => {
    let neighbors = 0
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    for (const [dx, dy] of directions) {
      const newI = i + dx
      const newJ = j + dy
      if (newI >= 0 && newI < gridSize && newJ >= 0 && newJ < gridSize) {
        neighbors += grid[newI][newJ] ? 1 : 0
      }
    }

    return neighbors
  }

  // Calculate next generation
  const nextGeneration = useCallback(() => {
    setGrid((g) => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countNeighbors(g, i, j)

          // Apply custom rules
          if (cell) {
            // Living cell - check survive rules
            return surviveRules[neighbors]
          } else {
            // Dead cell - check birth rules
            return birthRules[neighbors]
          }
        }),
      )
      return newGrid
    })

    setGeneration((g) => g + 1)
  }, [gridSize, surviveRules, birthRules])

  // Run simulation
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return

    nextGeneration()

    setTimeout(runSimulation, speed)
  }, [nextGeneration, speed])

  // Start/stop simulation
  const toggleRunning = () => {
    setIsRunning(!isRunning)

    if (!isRunning) {
      runningRef.current = true
      runSimulation()
    }
  }

  // Random grid
  const randomizeGrid = () => {
    const newGrid = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(false)
          .map(() => Math.random() > 0.7),
      )
    setGrid(newGrid)
    setGeneration(0)
  }

  // Increase grid size
  const increaseGridSize = () => {
    if (gridSize < 50) {
      setGridSize(gridSize + 5)
    }
  }

  // Decrease grid size
  const decreaseGridSize = () => {
    if (gridSize > 10) {
      setGridSize(gridSize - 5)
    }
  }

  // Reset to Conway's original rules
  const resetToConwayRules = () => {
    setSurviveRules([false, false, true, true, false, false, false, false, false])
    setBirthRules([false, false, false, true, false, false, false, false, false])
  }

  // Make the selectPattern function available globally for the custom pattern dialog
  useEffect(() => {
    ;(window as any).selectCustomPattern = (pattern: number[][], name: string) => {
      selectPattern(pattern, name)
    }

    return () => {
      delete (window as any).selectCustomPattern
    }
  }, [])

  return (
    <GameProvider>
      <div className="flex flex-col items-center gap-6">
        <GameControls
          isRunning={isRunning}
          toggleRunning={toggleRunning}
          nextGeneration={nextGeneration}
          generation={generation}
          speed={speed}
          setSpeed={setSpeed}
          selectedPatternName={selectedPatternName}
          clearSelectedPattern={clearSelectedPattern}
        />

        <div className="flex flex-row-reverse gap-4">
          {/* Pattern selector - now on the opposite side and hidden by default */}
          {showPatterns && (
            <PatternSelector onSelectPattern={selectPattern} selectedPatternName={selectedPatternName} />
          )}

          {/* Game grid */}
          <GameGrid grid={grid} gridSize={gridSize} toggleCell={toggleCell} />
        </div>

        <div className="mt-2 text-sm text-gray-600 max-w-xl">
          <h2 className="font-bold mb-2">Reglas actuales:</h2>
          <ul className="list-disc pl-5">
            <li>
              Una célula viva sobrevive con{" "}
              {surviveRules
                .map((rule, i) => (rule ? i : null))
                .filter(Boolean)
                .join(", ")}{" "}
              vecinos
            </li>
            <li>
              Una célula muerta nace con{" "}
              {birthRules
                .map((rule, i) => (rule ? i : null))
                .filter(Boolean)
                .join(", ")}{" "}
              vecinos
            </li>
          </ul>
          <p className="mt-2">Haz clic en las celdas para activarlas cuando esté en pausa o selecciona un patrón</p>

          <div className="mt-4 flex justify-center">
            <RulesDialog isRunning={isRunning} />
          </div>
        </div>
      </div>
    </GameProvider>
  )
}
