import React, { useContext, useCallback, useRef, useEffect } from 'react'
import { Layer as LayerType } from '@fuchsia/types'
import interact from 'interactjs'
import { Interactable, InteractEvent } from '@interactjs/types'
import { useParams } from 'react-router-dom'
import AppContext from './app-context'
import CanvasContext, { DragParams } from './canvas-context'
import { insertLayer, updateLayer, deleteLayer, getLocation } from './updating'
import {
  useCreateComponentMutation,
  useDeleteComponentsMutation,
  useUpdateComponentMutation,
} from '../generated/graphql'
import Layer from '../components/Builder/Canvas/Layer'
import ReactDOM from 'react-dom'
import { gql } from '@apollo/client'

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
  const [updateComponent] = useUpdateComponentMutation()
  const { projectId } = useParams()
  const [createComponent] = useCreateComponentMutation({
    update(cache, { data }) {
      cache.modify({
        fields: {
          getComponents(existingComponents = []) {
            const newComponentRef = cache.writeFragment({
              data: data?.createComponent,
              fragment: gql`
                fragment ComponentFragment on Component {
                  _id
                  type
                  x
                  y
                  props
                  parent {
                    _id
                  }
                  children {
                    _id
                  }
                }
              `,
            })
            return [...existingComponents, newComponentRef]
          },
        },
      })
    },
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
              const parentId = event.target.id
              // temp
              if (parentId === 'main-canvas') {
                return
              }
              if (event.relatedTarget.id === 'new-element') {
                // insert component
                const layer = event.relatedTarget.dataset['layer']
                debugger
                if (layer) {
                  const jsonLayer = JSON.parse(layer)
                  createComponent({
                    variables: {
                      projectId,
                      componentInput: {
                        package: jsonLayer.package,
                        type: jsonLayer.type,
                        parent: parentId,
                        props: jsonLayer.props,
                      },
                    },
                  })
                }
              } else {
                // update component
                updateComponent({
                  variables: {
                    componentId: event.relatedTarget.id,
                    componentInput: {
                      parent: parentId,
                    },
                  },
                })
              }
              event.relatedTarget.classList.remove('can-drop')
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
