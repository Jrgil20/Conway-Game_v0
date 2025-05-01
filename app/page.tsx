"use client"

import { EmbeddableGameOfLife } from "@/components/embeddable-game-of-life"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Conway&apos;s Game of Life</h1>

        {/* Juego de la Vida sin ventana encapsuladora */}
        <EmbeddableGameOfLife width="100%" height="600px" initialGridSize={25} />

        <div className="mt-8 text-center text-gray-600">
          <p>
            El Juego de la Vida de Conway es un autómata celular diseñado por el matemático británico John Horton Conway
            en 1970.
          </p>
          <p>
            Es un juego de cero jugadores, lo que significa que su evolución está determinada por su estado inicial y no
            necesita ninguna entrada adicional. Se puede observar cómo los patrones evolucionan con el tiempo siguiendo
            reglas simples.
          </p>
        </div>
      </div>
    </main>
  )
}
