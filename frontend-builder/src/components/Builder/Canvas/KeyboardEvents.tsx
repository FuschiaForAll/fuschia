import React, { useEffect, useCallback } from 'react'
import { useDeleteComponent, useSelection } from '../../../utils/hooks'

const DELETE = 'Delete'
const BACKSPACE = 'Backspace'

const KeyboardEvents: React.FC = function KeyboardEvents() {
  const { selection } = useSelection()
  const deleteLayers = useDeleteComponent()

  const handleDelete = useCallback(() => {
    if (!selection) return

    deleteLayers(...selection)
  }, [selection, deleteLayers])

  const keyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key
      if (key === DELETE || key === BACKSPACE) {
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
