import { createContext } from 'react'
import { Layer } from '@fuchsia/types'

export type Position = [x: number, y: number]

export interface DragParams {
  dragActive?: boolean
  dragPosition?: Position
  dragLayer?: string | Layer // id or new layer
  dropTarget?: string // ID of layer
  dropInside?: boolean // Drop before or inside
}

export interface CanvasState extends DragParams {
  scale: number
  position: Position
  selection?: Array<string>
}

interface CanvasContext {
  state: CanvasState
  onChange: (state: CanvasState) => void
}

export const DEFAULT_CANVAS_STATE: CanvasState = {
  scale: 1,
  position: [0, 0],
  selection: undefined,
}

const Context = createContext<CanvasContext>({
  state: DEFAULT_CANVAS_STATE,
  onChange: () => {},
})

export default Context
