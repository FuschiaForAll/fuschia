import React, { useContext, useCallback, useRef, useEffect } from 'react'
import { Layer as LayerType } from '@fuchsia/types'
import interact from 'interactjs'
import { Interactable, InteractEvent } from '@interactjs/types'
import { useParams } from 'react-router-dom'
import AppContext from './app-context'
import CanvasContext, { DragParams } from './canvas-context'
import { insertLayer, updateLayer, deleteLayer, getLocation } from './updating'
import {
  GetComponentsDocument,
  useCreateComponentMutation,
  useDeleteComponentsMutation,
  useUpdateComponentMutation,
} from '../generated/graphql'
import Layer from '../components/Builder/Canvas/Layer'
import ReactDOM from 'react-dom'
import { gql, useApolloClient } from '@apollo/client'

export type Selection = string[] | undefined

interface SelectionResponse {
  selection: Selection
  setSelection: (selection?: string[]) => void
}

interface DragResponse extends DragParams {
  ref: React.RefObject<HTMLDivElement>
}

type UpdateFunc = (id: string, value: LayerType) => void
type InsertFunc = (id: string, value: LayerType, insertAfter?: boolean) => void
type DeleteFunc = (...ids: string[]) => void

// Selection

export const useSelection = (): SelectionResponse => {
  const { state: canvasState, onChange } = useContext(CanvasContext)
  const { selection } = canvasState

  const setSelection = useCallback(
    selection => {
      const newSelection = selection?.length === 0 ? undefined : selection

      onChange({ ...canvasState, selection: newSelection })
    },
    [canvasState, onChange]
  )

  return { selection, setSelection }
}

// Dragging
interface DragDropOptions {
  min?: { width: number; height: number }
  draggable?: {
    onDragEnd: (id: string, position: { x: number; y: number }) => void
  }
  resizable?: {
    onResizeEnd: (
      id: string,
      size: { width: string; height: string },
      position: { x: number; y: number }
    ) => void
  }
  droppable?: {
    dropClass: string
    onDrop: () => void
  }
}

export const useClone = () => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let interaction: Interactable
    if (ref.current) {
      interaction = interact(ref.current)
      interaction.draggable({ manualStart: true }).on('move', function (event) {
        var interaction = event.interaction

        if (interaction.pointerIsDown && !interaction.interacting()) {
          const clone = event.currentTarget.cloneNode(true)
          document.getElementById('objectCollection')?.appendChild(clone)
          interaction.start({ name: 'drag' }, event.interactable, clone)
        }
      })
    }
    return () => interaction?.unset()
  }, [])
  return {
    ref,
  }
}

export const useDragDrop = (
  id: string,
  options?: DragDropOptions
): DragResponse => {
  const { projectId } = useParams()
  const [updateComponent] = useUpdateComponentMutation({
    refetchQueries: [
      { query: GetComponentsDocument, variables: { projectId } },
    ],
  })
  const [createComponent] = useCreateComponentMutation({
    refetchQueries: [
      { query: GetComponentsDocument, variables: { projectId } },
    ],
  })
  const [deleteComponents] = useDeleteComponentsMutation({
    refetchQueries: [
      { query: GetComponentsDocument, variables: { projectId } },
    ],
  })
  const ref = useRef<HTMLDivElement>(null)
  const { state: canvasState } = useContext(CanvasContext)
  useEffect(() => {
    let interaction: Interactable
    if (ref.current) {
      interaction = interact(ref.current)
      if (options) {
        const { draggable, resizable, droppable } = options
        if (draggable) {
          interaction
            .on('dragend', (event: InteractEvent) => {
              var target = event.target
              if (target.classList.contains('deleted')) {
                return
              }
              const x =
                (parseFloat(target.style.left) || 0) +
                  parseFloat(target.getAttribute('data-x')!) || 0
              const y =
                (parseFloat(target.style.top) || 0) +
                  parseFloat(target.getAttribute('data-y')!) || 0
              target.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)'
              target.setAttribute('data-x', '0px')
              target.setAttribute('data-y', '0px')
              target.style.left = `${x}px`
              target.style.top = `${y}px`
              draggable.onDragEnd(id, { x, y })
            })
            .draggable({
              inertia: true,
              autoScroll: true,
              listeners: {
                start: event => {
                  const target = event.target
                  if (event.target.classList.contains('root-element')) {
                    return
                  }
                  target.parentElement.id = 'drag-and-drop-origin'
                  document.getElementById('main-canvas')?.appendChild(target)
                  var x = event.x0
                  var y = event.y0
                  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
                  target.setAttribute('data-x', x)
                  target.setAttribute('data-y', y)
                  target.style.left = 0
                  target.style.top = 0
                },
                move: event => {
                  var target = event.target
                  var x =
                    (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                  var y =
                    (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
                  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
                  target.setAttribute('data-x', x)
                  target.setAttribute('data-y', y)
                },
              },
            })
        }
        if (resizable) {
          interaction
            .on('resizeend', (event: InteractEvent) => {
              var target = event.target
              const x =
                (parseFloat(target.style.left) || 0) +
                  parseFloat(target.getAttribute('data-x')!) || 0
              const y =
                (parseFloat(target.style.top) || 0) +
                  parseFloat(target.getAttribute('data-y')!) || 0
              target.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)'
              target.setAttribute('data-x', '0px')
              target.setAttribute('data-y', '0px')
              target.style.left = `${x}px`
              target.style.top = `${y}px`
              resizable.onResizeEnd(
                id,
                { width: target.style.width, height: target.style.height },
                { x, y }
              )
            })
            .resizable({
              // resize from all edges and corners
              edges: { left: true, right: true, bottom: true, top: true },
              listeners: {
                move(event) {
                  var target = event.target
                  var x = parseFloat(target.getAttribute('data-x')) || 0
                  var y = parseFloat(target.getAttribute('data-y')) || 0

                  // update the element's style
                  target.style.width = event.rect.width + 'px'
                  target.style.height = event.rect.height + 'px'

                  // translate when resizing from top or left edges
                  x += event.deltaRect.left
                  y += event.deltaRect.top

                  target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

                  target.setAttribute('data-x', x)
                  target.setAttribute('data-y', y)
                },
              },
              modifiers: [
                interact.modifiers.restrictEdges({
                  outer: 'parent',
                }),

                interact.modifiers.restrictSize({
                  min: { width: 100, height: 50 },
                }),
              ],

              inertia: true,
            })
        }
        if (droppable) {
          interaction.dropzone({
            // only accept elements matching this CSS selector
            accept: '.droppable',
            // Require a 75% element overlap for a drop to be possible
            overlap: 0.75,

            // listen for drop related events:

            ondropactivate: function (event) {
              // add active dropzone feedback
              event.target.classList.add('drop-active')
            },
            ondragenter: function (event) {
              var draggableElement = event.relatedTarget
              var dropzoneElement = event.target

              // feedback the possibility of a drop
              dropzoneElement.classList.add('drop-target')
              draggableElement.classList.add('can-drop')
            },
            ondragleave: function (event) {
              // remove the drop feedback style
              event.target.classList.remove('drop-target')
              event.relatedTarget.classList.remove('can-drop')
            },
            ondrop: function (event) {
              event.relatedTarget.classList.remove('can-drop')
              const parentId = event.target.id
              // temp
              if (parentId === 'main-canvas') {
                // if a non-root element is dropped on the main canvas, delete it
                if (!event.relatedTarget.classList.contains('root-element')) {
                  const parentdnd = document.getElementById(
                    'drag-and-drop-origin'
                  )
                  if (parentdnd) {
                    parentdnd.id = ''
                    parentdnd.appendChild(event.relatedTarget)
                  }
                  event.relatedTarget.classList.add('deleted')
                  if (event.relatedTarget.id !== 'new-element') {
                    deleteComponents({
                      variables: {
                        projectId,
                        componentIds: [event.relatedTarget.id],
                      },
                    })
                  }
                }
                return
              }
              if (event.relatedTarget.id === 'new-element') {
                // insert component
                const layer = event.relatedTarget.dataset['layer']
                if (layer) {
                  const jsonLayer = JSON.parse(layer)
                  // calculate relative x and y
                  const parentX = parseFloat(event.target.style.left) || 0
                  const parentY = parseFloat(event.target.style.top) || 0
                  const x =
                    (parseFloat(event.relatedTarget.style.left) || 0) +
                    (parseFloat(event.relatedTarget.getAttribute('data-x')!) ||
                      0) -
                    parentX
                  const y =
                    (parseFloat(event.relatedTarget.style.top) || 0) +
                    (parseFloat(event.relatedTarget.getAttribute('data-y')!) ||
                      0) -
                    parentY
                  event.relatedTarget.style.transform =
                    'translate(' + 0 + 'px, ' + 0 + 'px)'
                  event.relatedTarget.setAttribute('data-x', `${0}px`)
                  event.relatedTarget.setAttribute('data-y', `${0}px`)
                  event.relatedTarget.style.left = `${x}px`
                  event.relatedTarget.style.top = `${y}px`

                  createComponent({
                    variables: {
                      projectId,
                      componentInput: {
                        isRootElement: jsonLayer.isRootElement,
                        isContainer: jsonLayer.isContainer,
                        package: jsonLayer.package,
                        type: jsonLayer.type,
                        parent: parentId,
                        props: jsonLayer.props,
                        x,
                        y,
                      },
                    },
                  })
                }
              } else {
                // update component
                console.warn(
                  `This will refetch the entire component tree, this is wickedly inefficient`
                )
                const parentdnd = document.getElementById(
                  'drag-and-drop-origin'
                )
                if (parentdnd) {
                  parentdnd.id = ''
                  parentdnd.appendChild(event.relatedTarget)
                }
                // adjust to be relative to drop parent
                const parentX = parseFloat(event.target.style.left) || 0
                const parentY = parseFloat(event.target.style.top) || 0
                const x =
                  (parseFloat(event.relatedTarget.style.left) || 0) +
                  (parseFloat(event.relatedTarget.getAttribute('data-x')!) ||
                    0) -
                  parentX
                const y =
                  (parseFloat(event.relatedTarget.style.top) || 0) +
                  (parseFloat(event.relatedTarget.getAttribute('data-y')!) ||
                    0) -
                  parentY
                event.relatedTarget.style.transform =
                  'translate(' + 0 + 'px, ' + 0 + 'px)'
                event.relatedTarget.setAttribute('data-x', `${0}px`)
                event.relatedTarget.setAttribute('data-y', `${0}px`)
                event.relatedTarget.style.left = `${x}px`
                event.relatedTarget.style.top = `${y}px`
                updateComponent({
                  variables: {
                    componentId: event.relatedTarget.id,
                    componentInput: {
                      parent: parentId,
                    },
                  },
                })
              }
            },
            ondropdeactivate: function (event) {
              // remove active dropzone feedback
              event.target.classList.remove('drop-active')
              event.target.classList.remove('drop-target')
            },
          })
        }
      }
    }
    return () => interaction?.unset()
  }, [id, options, updateComponent])
  const { dragActive, dragPosition, dragLayer, dropTarget, dropInside } =
    canvasState

  return {
    dragActive,
    dragPosition,
    dragLayer,
    dropTarget,
    dropInside,
    ref,
  }
}

// Update / Insert / Delete
export const useUpdate = (): UpdateFunc => {
  const { body, setBody } = useContext(AppContext)

  const updateFunc = useCallback<UpdateFunc>(
    (id, value) => {
      const location = getLocation(body, id)
      const result = updateLayer(body, location, value)
      setBody(result)
    },
    [body, setBody]
  )

  return updateFunc
}

export const useInsert = (): InsertFunc => {
  const { body, setBody } = useContext(AppContext)
  const { setSelection } = useSelection()

  const insertFunc = useCallback<InsertFunc>(
    (id, value, insertAfter = false) => {
      const location = getLocation(body, id)
      const result = insertLayer(body, location, value, insertAfter)
      setBody(result)
      setSelection([value.id])
    },
    [body, setBody, setSelection]
  )

  return insertFunc
}

export const useDelete = (): DeleteFunc => {
  const { body, setBody } = useContext(AppContext)
  const { selection, setSelection } = useSelection()
  const [deleteComponents] = useDeleteComponentsMutation({
    update(cache, { data }) {
      cache.modify({
        fields: {
          getComponents(existingComponents = [], { readField }) {
            return [
              ...(existingComponents as any[]).filter(item => {
                return data?.deleteComponents.find(
                  id => readField('_id', item) !== id
                )
              }),
            ]
          },
        },
      })
    },
  })
  const { projectId } = useParams()

  const deleteFunc = useCallback<DeleteFunc>(
    (...ids) => {
      let result = body
      deleteComponents({
        variables: {
          projectId,
          componentIds: ids,
        },
      })
      for (const id of ids) {
        const location = getLocation(body, id)
        result = deleteLayer(result, location)
      }

      setBody(result)
      setSelection(
        selection?.filter((id: string): boolean => !ids.includes(id))
      )
    },
    [body, deleteComponents, projectId, setBody, setSelection, selection]
  )

  return deleteFunc
}
