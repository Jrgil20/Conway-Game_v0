"use client"

type GameGridProps = {
  grid: boolean[][]
  gridSize: number
  toggleCell: (i: number, j: number) => void
}

export function GameGrid({ grid, gridSize, toggleCell }: GameGridProps) {
  return (
    <div
      className="grid border border-gray-300 rounded-md overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: "1px",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => toggleCell(i, j)}
            className={`w-3 h-3 md:w-4 md:h-4 ${
              cell ? "bg-black" : "bg-white hover:bg-gray-100"
            } cursor-pointer transition-colors duration-100`}
          />
        )),
      )}
    </div>
  )
}
