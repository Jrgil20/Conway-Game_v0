"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { EmbeddableGameOfLife, type GameOfLifeAPI } from "./embeddable-game-of-life"

type GameWindowProps = {
  title?: string
  width?: number | string
  height?: number | string
  initialGridSize?: number
  className?: string
}

export function GameWindow({
  title = "Conway's Game of Life",
  width = 600,
  height = 500,
  initialGridSize = 25,
  className = "",
}: GameWindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [gameApi, setGameApi] = useState<GameOfLifeAPI | null>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("window-header")) {
      setIsDragging(true)
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const handleGameInitialized = (api: GameOfLifeAPI) => {
    setGameApi(api)
  }

  return (
    <div
      ref={windowRef}
      className={`absolute rounded-lg shadow-xl border border-gray-300 bg-white overflow-hidden ${className} ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        width,
        height,
        left: position.x,
        top: position.y,
      }}
    >
      <div
        className="window-header h-10 bg-gray-100 border-b border-gray-300 flex items-center justify-between px-4"
        onMouseDown={handleMouseDown}
      >
        <div className="font-medium">{title}</div>
        <div className="flex gap-2">
          <button
            className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
            onClick={() => gameApi?.start()}
          >
            ▶
          </button>
          <button
            className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
            onClick={() => gameApi?.pause()}
          >
            ⏸
          </button>
        </div>
      </div>
      <div className="window-content" style={{ height: "calc(100% - 2.5rem)" }}>
        <EmbeddableGameOfLife
          width="100%"
          height="100%"
          initialGridSize={initialGridSize}
          onInitialized={handleGameInitialized}
        />
      </div>
    </div>
  )
}
