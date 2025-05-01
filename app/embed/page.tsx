"use client"

import { useState } from "react"
import { GameWindow } from "@/components/game-window"
import { Button } from "@/components/ui/button"

export default function EmbedPage() {
  const [windows, setWindows] = useState<{ id: number; size: number }[]>([])
  const [nextId, setNextId] = useState(1)

  const createNewWindow = () => {
    setWindows([...windows, { id: nextId, size: 20 + Math.floor(Math.random() * 15) }])
    setNextId(nextId + 1)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Game of Life - Ventanas Embebidas</h1>

        <div className="mb-8">
          <p className="mb-4">
            Esta demostración muestra cómo el Juego de la Vida puede ser embebido como ventanas independientes dentro de
            cualquier aplicación. Cada instancia tiene su propio estado y controles.
          </p>

          <Button onClick={createNewWindow} className="mt-4">
            Crear Nueva Ventana
          </Button>
        </div>

        <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-[600px] bg-gray-50">
          {windows.map((window) => (
            <GameWindow
              key={window.id}
              title={`Game of Life #${window.id}`}
              width={350}
              height={350}
              initialGridSize={window.size}
            />
          ))}

          {windows.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Haz clic en "Crear Nueva Ventana" para comenzar
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
