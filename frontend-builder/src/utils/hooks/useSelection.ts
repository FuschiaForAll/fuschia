import { useContext, useCallback } from 'react'
import CanvasContext from '../canvas-context'

export type Selection = string[] | undefined

interface SelectionResponse {
  selection: Selection
  setSelection: (selection?: string[]) => void
}

export const useSelection = (): SelectionResponse => {
  const { state: canvasState, onChange } = useContext(CanvasContext)
  const { selection } = canvasState

  const setSelection = useCallback(
    selection => {
      const newSelection = selection?.length === 0 ? undefined : selection

      onChange({ ...canvasState, selection: newSelection })
    },
    [canvasState, onChange]
  )

  return { selection, setSelection }
}
