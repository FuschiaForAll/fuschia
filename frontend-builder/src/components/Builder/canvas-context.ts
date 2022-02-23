import { createContext } from 'react'

export interface CanvasState {
  scale: number
  x: number
  y: number
  selection?: Array<string>
}

interface CanvasContext {
  state: CanvasState
  onChange: (state: CanvasState) => void
}

export const DEFAULT_CANVAS_STATE: CanvasState = {
  scale: 1,
  x: 0,
  y: 0,
  selection: undefined,
}

const Context = createContext<CanvasContext>({
  state: DEFAULT_CANVAS_STATE,
  onChange: () => {},
})

export default Context
