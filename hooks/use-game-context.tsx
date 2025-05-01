"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type GameContextType = {
  gridSize: number
  setGridSize: (size: number) => void
  increaseGridSize: () => void
  decreaseGridSize: () => void
  randomizeGrid: () => void
  initializeGrid: () => void
  showPatterns: boolean
  setShowPatterns: (show: boolean) => void
  surviveRules: boolean[]
  setSurviveRules: (rules: boolean[]) => void
  birthRules: boolean[]
  setBirthRules: (rules: boolean[]) => void
  resetToConwayRules: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gridSize, setGridSize] = useState(25)
  const [showPatterns, setShowPatterns] = useState(false)
  const [surviveRules, setSurviveRules] = useState([false, false, true, true, false, false, false, false, false])
  const [birthRules, setBirthRules] = useState([false, false, false, true, false, false, false, false, false])

  const increaseGridSize = useCallback(() => {
    if (gridSize < 50) {
      setGridSize(gridSize + 5)
    }
  }, [gridSize])

  const decreaseGridSize = useCallback(() => {
    if (gridSize > 10) {
      setGridSize(gridSize - 5)
    }
  }, [gridSize])

  const randomizeGrid = useCallback(() => {
    // This is just a placeholder - the actual implementation is in the main component
    // We're just providing the function in the context
  }, [])

  const initializeGrid = useCallback(() => {
    // This is just a placeholder - the actual implementation is in the main component
  }, [])

  const resetToConwayRules = useCallback(() => {
    setSurviveRules([false, false, true, true, false, false, false, false, false])
    setBirthRules([false, false, false, true, false, false, false, false, false])
  }, [])

  return (
    <GameContext.Provider
      value={{
        gridSize,
        setGridSize,
        increaseGridSize,
        decreaseGridSize,
        randomizeGrid,
        initializeGrid,
        showPatterns,
        setShowPatterns,
        surviveRules,
        setSurviveRules,
        birthRules,
        setBirthRules,
        resetToConwayRules,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}
