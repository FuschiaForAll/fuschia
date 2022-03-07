import React, { useContext, useRef, useEffect } from 'react'
import interact from 'interactjs'
import { Interactable, InteractEvent } from '@interactjs/types'
import { useParams } from 'react-router-dom'
import CanvasContext, { DragParams } from '../canvas-context'
import {
  GetComponentsDocument,
  useCreateComponentMutation,
  useDeleteComponentsMutation,
  useUpdateComponentMutation,
} from '../../generated/graphql'

interface DragResponse extends DragParams {
  ref: React.RefObject<HTMLDivElement>
}

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
  }, [
    createComponent,
    deleteComponents,
    id,
    options,
    projectId,
    updateComponent,
  ])
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
