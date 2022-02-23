import React, { useEffect, useContext, useCallback } from 'react'
import AppContext from '../context'
import CanvasContext from '../canvas-context'

const DELETE = 8

const KeyboardEvents: React.FC = function KeyboardEvents() {
  const { state: canvasState, onChange: setCanvasState } =
    useContext(CanvasContext)

  const { body, setBody } = useContext(AppContext)

  const handleDelete = useCallback(() => {
    const { selection } = canvasState

    if (!selection) return

    const newBody = {
      ...body,
      objects: body.objects.filter(obj => !selection.includes(obj.id)),
    }

    setBody(newBody)

    setCanvasState({ ...canvasState, selection: undefined })
  }, [body, canvasState, setBody, setCanvasState])

  const keyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.which

      if (key === DELETE) {
        handleDelete()
      }
    },
    [handleDelete]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyDown)

    return () => document.removeEventListener('keydown', keyDown)
  }, [keyDown])

  return null
}

export default KeyboardEvents
