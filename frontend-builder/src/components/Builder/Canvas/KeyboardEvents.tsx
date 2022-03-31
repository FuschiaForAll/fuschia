import React, { useEffect, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  GetComponentsDocument,
  useDuplicateComponentMutation,
} from '../../../generated/graphql'
import {
  useDeleteComponents,
  useSelection,
  useUpdateComponent,
} from '../../../utils/hooks'
import { useDesignerHistory } from '../../../utils/hooks/useDesignerHistory'

const DELETE = 'Delete'
const RIGHT_ARROW = 'ArrowRight'
const LEFT_ARROW = 'ArrowLeft'
const UP_ARROW = 'ArrowUp'
const DOWN_ARROW = 'ArrowDown'
const ESCAPE = 'Escape'

const KeyboardEvents: React.FC = function KeyboardEvents() {
  const { projectId } = useParams<{ projectId: string }>()
  const { selection, setSelection } = useSelection()
  const deleteLayers = useDeleteComponents()
  const { updateComponent: updateLayers } = useUpdateComponent()
  const [cloneComponent] = useDuplicateComponentMutation({
    refetchQueries: [
      { query: GetComponentsDocument, variables: { projectId } },
    ],
  })
  const [copyReferences, setCopyReferences] = useState<string[] | undefined>()
  const handleDelete = useCallback(() => {
    if (!selection) return
    deleteLayers(...selection)
    setSelection([])
  }, [selection, deleteLayers, setSelection])
  const { undo, redo } = useDesignerHistory()
  const handleMove = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!selection) return
      console.info('The server should allow multiple updates')
      selection.forEach(id => {
        const element = document.getElementById(id)
        if (element) {
          updateLayers(
            id,
            {
              x: parseInt(element.style.left) + x,
              y: parseInt(element.style.top) + y,
            },
            {
              x: parseInt(element.style.left),
              y: parseInt(element.style.top),
            }
          )
        }
      })
    },
    [selection, updateLayers]
  )

  const handleCopy = useCallback(() => {
    if (!selection) return
    setCopyReferences(selection)
  }, [selection])

  const handleUndo = useCallback(() => {
    undo()
  }, [undo])

  const handleRedo = useCallback(() => {
    redo()
  }, [redo])

  const handlePaste = useCallback(() => {
    if (!copyReferences || copyReferences.length === 0) return
    cloneComponent({
      variables: {
        componentId: copyReferences[0],
        projectId,
      },
    })
    setCopyReferences(undefined)
  }, [cloneComponent, copyReferences, projectId])

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
        case 'z':
          if (e.ctrlKey) {
            handleUndo()
          }
          break
        case 'y':
          if (e.ctrlKey) {
            handleRedo()
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
    [
      handleClearSelection,
      handleCopy,
      handleDelete,
      handleMove,
      handlePaste,
      handleRedo,
      handleUndo,
    ]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyDown)

    return () => document.removeEventListener('keydown', keyDown)
  }, [keyDown])

  return null
}

export default KeyboardEvents
