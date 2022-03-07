import React, { useEffect, useCallback } from 'react'
import { useDeleteComponents, useSelection } from '../../../utils/hooks'

const DELETE = 'Delete'
const BACKSPACE = 'Backspace'

const KeyboardEvents: React.FC = function KeyboardEvents() {
  const { selection, setSelection } = useSelection()
  const deleteLayers = useDeleteComponents()

  const handleDelete = useCallback(() => {
    if (!selection) return
    deleteLayers(...selection)
    setSelection([])
  }, [selection, deleteLayers, setSelection])

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
