import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react'

interface Action {
  up: () => void
  down: () => void
}
interface ProjectHistory {
  past: Action[]
  future: Action[]
}

interface IDesignerHistoryContext {
  undo: () => void
  redo: () => void
  performAction: (action: Action) => void
  history: ProjectHistory
}

export const DesignerHistoryContext = createContext<IDesignerHistoryContext>({
  history: { past: [], future: [] },
  undo: () => null,
  redo: () => null,
  performAction: action => null,
})

export const DesignerHistoryProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const historyRef = useRef<ProjectHistory>({
    past: [],
    future: [],
  })
  function performAction(action: Action) {
    historyRef.current.past.push(action)
    historyRef.current.future = []
  }
  function undo() {
    const action = historyRef.current.past.pop()
    if (action) {
      historyRef.current.future.push(action)
      action.down()
    }
  }
  function redo() {
    const action = historyRef.current.future.pop()
    if (action) {
      historyRef.current.past.push(action)
      action.up()
    }
  }
  return (
    <DesignerHistoryContext.Provider
      value={{
        history: historyRef.current,
        performAction,
        undo,
        redo,
      }}
    >
      {children}
    </DesignerHistoryContext.Provider>
  )
}

export function useDesignerHistory() {
  return useContext(DesignerHistoryContext)
}
