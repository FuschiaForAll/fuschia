import React, { useEffect, useCallback } from 'react'
import { useDelete, useSelection } from '../../../utils/hooks'

const DELETE = 8

const KeyboardEvents: React.FC = function KeyboardEvents() {
  const { selection } = useSelection()
  const deleteLayers = useDelete()

  const handleDelete = useCallback(() => {
    if (!selection) return

    deleteLayers(...selection)
  }, [selection, deleteLayers])

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
