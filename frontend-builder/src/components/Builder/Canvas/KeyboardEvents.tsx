import React, { useEffect, useCallback, useState } from 'react'
import {
  useDeleteComponents,
  useSelection,
  useUpdateComponent,
} from '../../../utils/hooks'

const DELETE = 'Delete'
const RIGHT_ARROW = 'ArrowRight'
const LEFT_ARROW = 'ArrowLeft'
const UP_ARROW = 'ArrowUp'
const DOWN_ARROW = 'ArrowDown'
const ESCAPE = 'Escape'

const KeyboardEvents: React.FC = function KeyboardEvents() {
  const { selection, setSelection } = useSelection()
  const deleteLayers = useDeleteComponents()
  const updateLayers = useUpdateComponent()
  const [copyReferences, setCopyReferences] = useState<string[] | undefined>()
  const handleDelete = useCallback(() => {
    if (!selection) return
    deleteLayers(...selection)
    setSelection([])
  }, [selection, deleteLayers, setSelection])

  const handleMove = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!selection) return
      console.info('The server should allow multiple updates')
      selection.forEach(id => {
        const element = document.getElementById(id)
        if (element) {
          updateLayers(id, {
            x: parseInt(element.style.left) + x,
            y: parseInt(element.style.top) + y,
          })
        }
      })
    },
    [selection, updateLayers]
  )

  const handleCopy = useCallback(() => {
    if (!selection) return
    setCopyReferences(selection)
  }, [selection])

  const handlePaste = useCallback(() => {
    if (!copyReferences) return
    alert(copyReferences)
    setCopyReferences(undefined)
  }, [copyReferences])

  const handleClearSelection = useCallback(() => {
    setSelection()
  }, [setSelection])

  const keyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key
      switch (key) {
        case DELETE:
          handleDelete()
          break
        case 'c':
          if (e.ctrlKey) {
            handleCopy()
          }
          break
        case 'v':
          if (e.ctrlKey) {
            handlePaste()
          }
          break

        case RIGHT_ARROW:
          handleMove({ x: e.shiftKey ? 10 : 1, y: 0 })
          break
        case LEFT_ARROW:
          handleMove({ x: e.shiftKey ? -10 : -1, y: 0 })
          break
        case UP_ARROW:
          handleMove({ x: 0, y: e.shiftKey ? -10 : -1 })
          break
        case DOWN_ARROW:
          handleMove({ x: 0, y: e.shiftKey ? 10 : 1 })
          break
        case ESCAPE:
          handleClearSelection()
          break
        default:
          console.log(key)
      }
    },
    [handleClearSelection, handleCopy, handleDelete, handleMove, handlePaste]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyDown)

    return () => document.removeEventListener('keydown', keyDown)
  }, [keyDown])

  return null
}

export default KeyboardEvents
