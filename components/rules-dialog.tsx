"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useGameContext } from "@/hooks/use-game-context"

type RulesDialogProps = {
  isRunning: boolean
}

export function RulesDialog({ isRunning }: RulesDialogProps) {
  const { surviveRules, setSurviveRules, birthRules, setBirthRules, resetToConwayRules } = useGameContext()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isRunning} className="flex items-center gap-2">
          Reglas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuración de Reglas</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h3 className="mb-2 font-medium">Reglas de Supervivencia</h3>
            <p className="text-sm text-gray-500 mb-2">Una célula viva sobrevive si tiene este número de vecinos:</p>
            <div className="flex gap-2 flex-wrap">
              {surviveRules.map((rule, i) => (
                <div key={`survive-${i}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`survive-${i}`}
                    checked={rule}
                    onCheckedChange={(checked) => {
                      const newRules = [...surviveRules]
                      newRules[i] = checked === true
                      setSurviveRules(newRules)
                    }}
                    disabled={isRunning}
                  />
                  <label
                    htmlFor={`survive-${i}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {i}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Reglas de Nacimiento</h3>
            <p className="text-sm text-gray-500 mb-2">Una célula muerta nace si tiene este número de vecinos:</p>
            <div className="flex gap-2 flex-wrap">
              {birthRules.map((rule, i) => (
                <div key={`birth-${i}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`birth-${i}`}
                    checked={rule}
                    onCheckedChange={(checked) => {
                      const newRules = [...birthRules]
                      newRules[i] = checked === true
                      setBirthRules(newRules)
                    }}
                    disabled={isRunning}
                  />
                  <label
                    htmlFor={`birth-${i}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {i}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={resetToConwayRules} disabled={isRunning}>
              Restaurar Reglas de Conway
            </Button>
            <DialogClose asChild>
              <Button variant="default">Cerrar</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
