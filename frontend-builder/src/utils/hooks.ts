import { useContext, useCallback } from 'react'
import { Layer } from '@fuchsia/types'

import AppContext from './app-context'
import CanvasContext, { Position, DragParams } from './canvas-context'
import { insertLayer, updateLayer, deleteLayer, getLocation } from './updating'

export type Selection = string[] | undefined

interface SelectionResponse {
  selection: Selection
  setSelection: (selection?: string[]) => void
}

interface DragResponse extends DragParams {
  onStartDrag: (dragLayer: string | Layer) => void
  onDrag: (position: Position) => void
  onDrop: () => void
}

type UpdateFunc = (id: string, value: Layer) => void
type InsertFunc = (id: string, value: Layer, insertAfter?: boolean) => void
type DeleteFunc = (...ids: string[]) => void

// Selection

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

// Dragging

export const useDrag = (): DragResponse => {
  const { state: canvasState, onChange } = useContext(CanvasContext)

  const { dragActive, dragPosition, dragLayer, dropTarget, dropInside } =
    canvasState

  const onStartDrag = useCallback(
    (dragLayer: string | Layer) => {
      onChange({
        ...canvasState,
        dragLayer,
        dragActive: true,
      })
    },
    [canvasState, onChange]
  )

  const onDrag = useCallback(
    (position: Position) => {
      onChange({
        ...canvasState,
        dragPosition: position,
      })
    },
    [canvasState, onChange]
  )

  const onDrop = useCallback(() => {
    onChange({
      ...canvasState,
      dragActive: false,
      dragPosition: undefined,
      dragLayer: undefined,
      dropTarget: undefined,
      dropInside: undefined,
    })
  }, [canvasState, onChange])

  return {
    dragActive,
    dragPosition,
    dragLayer,
    dropTarget,
    dropInside,
    onStartDrag,
    onDrag,
    onDrop,
  }
}

// Update / Insert / Delete
export const useUpdate = (): UpdateFunc => {
  const { body, setBody } = useContext(AppContext)

  const updateFunc = useCallback<UpdateFunc>(
    (id, value) => {
      const location = getLocation(body, id)
      const result = updateLayer(body, location, value)
      setBody(result)
    },
    [body, setBody]
  )

  return updateFunc
}

export const useInsert = (): InsertFunc => {
  const { body, setBody } = useContext(AppContext)
  const { setSelection } = useSelection()

  const insertFunc = useCallback<InsertFunc>(
    (id, value, insertAfter = false) => {
      const location = getLocation(body, id)
      const result = insertLayer(body, location, value, insertAfter)
      setBody(result)
      setSelection([value.id])
    },
    [body, setBody, setSelection]
  )

  return insertFunc
}

export const useDelete = (): DeleteFunc => {
  const { body, setBody } = useContext(AppContext)
  const { selection, setSelection } = useSelection()

  const deleteFunc = useCallback<DeleteFunc>(
    (...ids) => {
      let result = body

      for (const id of ids) {
        const location = getLocation(body, id)
        result = deleteLayer(result, location)
      }

      setBody(result)
      setSelection(
        selection?.filter((id: string): boolean => !ids.includes(id))
      )
    },
    [body, setBody, selection, setSelection]
  )

  return deleteFunc
}
