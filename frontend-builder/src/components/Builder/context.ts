import { createContext } from 'react'
import type { AppBody } from '@fuchsia/types'

interface BodyContext {
  body: AppBody
  setBody: (body: AppBody) => void
}

export const DEFAULT_BODY: AppBody = {
  objects: [],
}

const Context = createContext<BodyContext>({
  body: DEFAULT_BODY,
  setBody: () => {},
})

export default Context
