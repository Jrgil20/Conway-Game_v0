"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { GameGrid } from "./game-grid"
import { PatternSelector } from "./pattern-selector"
import { ConfigMenu } from "./config-menu"

// Public API for controlling the game externally
export type GameOfLifeAPI = {
  start: () => void
  pause: () => void
  step: () => void
  clear: () => void
  random: () => void
  setSpeed: (speed: number) => void
  isRunning: () => boolean
}

type EmbeddableGameOfLifeProps = {
  width?: number | string
  height?: number | string
  initialGridSize?: number
  onInitialized?: (api: GameOfLifeAPI) => void
  className?: string
}

export function EmbeddableGameOfLife({
  width = "100%",
  height = "600px",
  initialGridSize = 25,
  onInitialized,
  className = "",
}: EmbeddableGameOfLifeProps) {
  // Grid state
  const [gridSize, setGridSize] = useState(initialGridSize)
  const [grid, setGrid] = useState<boolean[][]>([])

  // Game state
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(200) // ms between generations
  const [generation, setGeneration] = useState(0)
  const [showPatterns, setShowPatterns] = useState(false)

  // Pattern selection
  const [selectedPattern, setSelectedPattern] = useState<number[][]>([])
  const [selectedPatternName, setSelectedPatternName] = useState("")
  const [customPatterns, setCustomPatterns] = useState<Array<{ name: string; pattern: number[][] }>>([])

  // Custom rules
  const [surviveRules, setSurviveRules] = useState([false, false, true, true, false, false, false, false, false])
  const [birthRules, setBirthRules] = useState([false, false, false, true, false, false, false, false, false])

  // Reference for animation loop
  const runningRef = useRef(isRunning)
  const animationFrameRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
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

  // Run simulation with requestAnimationFrame for smoother animation
  const runSimulation = useCallback(
    (timestamp: number) => {
      if (!runningRef.current) {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
        return
      }

      // Calculate elapsed time since last update
      const elapsed = timestamp - lastUpdateTimeRef.current

      // If enough time has passed, update the grid
      if (elapsed >= speed) {
        nextGeneration()
        lastUpdateTimeRef.current = timestamp
      }

      // Schedule the next frame
      animationFrameRef.current = requestAnimationFrame(runSimulation)
    },
    [nextGeneration, speed],
  )

  // Start/stop simulation
  const toggleRunning = () => {
    const newRunningState = !isRunning
    setIsRunning(newRunningState)

    if (newRunningState && !animationFrameRef.current) {
      runningRef.current = true
      lastUpdateTimeRef.current = performance.now()
      animationFrameRef.current = requestAnimationFrame(runSimulation)
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

  // Add a custom pattern
  const addCustomPattern = (pattern: number[][], name: string) => {
    setCustomPatterns((prev) => [...prev, { name, pattern }])
    selectPattern(pattern, name)
  }

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Expose API for external control
  useEffect(() => {
    if (onInitialized) {
      const api: GameOfLifeAPI = {
        start: () => {
          setIsRunning(true)
          runningRef.current = true
          if (!animationFrameRef.current) {
            lastUpdateTimeRef.current = performance.now()
            animationFrameRef.current = requestAnimationFrame(runSimulation)
          }
        },
        pause: () => {
          setIsRunning(false)
          runningRef.current = false
        },
        step: nextGeneration,
        clear: initializeGrid,
        random: randomizeGrid,
        setSpeed: (s: number) => setSpeed(s),
        isRunning: () => isRunning,
      }
      onInitialized(api)
    }
  }, [onInitialized, isRunning, nextGeneration, initializeGrid, runSimulation])

  // Make the addCustomPattern function available globally for the custom pattern dialog
  useEffect(() => {
    ;(window as any).addCustomPattern = (pattern: number[][], name: string) => {
      addCustomPattern(pattern, name)
    }

    return () => {
      delete (window as any).addCustomPattern
    }
  }, [])

  return (
    <div className={`game-of-life-container ${className}`} style={{ width, height }}>
      <div className="flex flex-col items-center gap-4 h-full p-4 overflow-auto">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={toggleRunning}
            className="px-3 py-1 border rounded flex items-center gap-1 hover:bg-gray-100"
          >
            {isRunning ? (
              <>
                <span className="w-4 h-4">⏸️</span> Pausar
              </>
            ) : (
              <>
                <span className="w-4 h-4">▶️</span> Iniciar
              </>
            )}
          </button>

          <button
            onClick={nextGeneration}
            disabled={isRunning}
            className={`px-3 py-1 border rounded flex items-center gap-1 ${
              isRunning ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <span className="w-4 h-4">⏭️</span> Paso
          </button>

          <ConfigMenu
            isRunning={isRunning}
            gridSize={gridSize}
            increaseGridSize={increaseGridSize}
            decreaseGridSize={decreaseGridSize}
            randomizeGrid={randomizeGrid}
            initializeGrid={initializeGrid}
            showPatterns={showPatterns}
            setShowPatterns={setShowPatterns}
            addCustomPattern={addCustomPattern}
            speed={speed}
            setSpeed={setSpeed}
          />
        </div>

        <div className="flex items-center gap-2 justify-center">
          <span className="text-sm">Generación: {generation}</span>
          {selectedPatternName && (
            <div className="flex items-center gap-2">
              <span className="text-sm bg-blue-100 px-2 py-1 rounded-md">
                Patrón seleccionado: {selectedPatternName}
              </span>
              <button className="h-7 px-2 border rounded hover:bg-gray-100" onClick={clearSelectedPattern}>
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-row-reverse gap-4 overflow-auto">
          {/* Pattern selector - now on the opposite side and hidden by default */}
          {showPatterns && (
            <div className="pattern-selector-container">
              <PatternSelector
                onSelectPattern={selectPattern}
                selectedPatternName={selectedPatternName}
                customPatterns={customPatterns}
              />
            </div>
          )}

          {/* Game grid */}
          <div className="game-grid-container flex-1 overflow-auto">
            <GameGrid grid={grid} gridSize={gridSize} toggleCell={toggleCell} />
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-600 w-full max-w-xl">
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
        </div>
      </div>
    </div>
  )
}
