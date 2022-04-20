import React, { useRef, useEffect } from 'react'
import interact from 'interactjs'
import { Interactable, InteractEvent, Element } from '@interactjs/types'
import { useParams } from 'react-router-dom'
import { useDeleteComponents } from './useDeleteComponents'
import { useUpdateComponent } from './useUpdateComponent'
import { useInsertComponent } from './useInsertComponent'
import { gql, useQuery } from '@apollo/client'
import { LexoRankHelper } from '../lexoRankHelper'

interface DragResponse {
  ref: React.RefObject<HTMLDivElement>
}

interface DragDropOptions {
  min?: { width: number; height: number }
  draggable?: {
    onDragEnd: (id: string) => void
    manualStart?: boolean
  }
  resizable?: {
    onResizeEnd: (
      id: string,
      size: { width: number; height: number },
      position: { x: number; y: number }
    ) => void
  }
  droppable?: {
    dropClass: string
    onDrop: () => void
  }
}

function updateAttribues(target: Element, x: number, y: number) {
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
  target.setAttribute('data-x', `${x}`)
  target.setAttribute('data-y', `${y}`)
}

function updatePosition(target: Element, left: number, top: number) {
  target.style.left = `${left}px`
  target.style.top = `${top}px`
}

function getDataAttributes(target: Element) {
  return [
    parseFloat(target.getAttribute('data-x')!) || 0,
    parseFloat(target.getAttribute('data-y')!) || 0,
  ]
}

function getPosition(target: Element) {
  return [parseFloat(target.style.left) || 0, parseFloat(target.style.top) || 0]
}

const stackFilterQuery = gql`
  query {
    stackFilter @client
  }
`

export const useDragDrop = (
  id: string,
  options?: DragDropOptions
): DragResponse => {
  const { projectId } = useParams()
  const createComponent = useInsertComponent()
  const deleteComponents = useDeleteComponents()
  const { updateComponent } = useUpdateComponent()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let interaction: Interactable
    if (ref.current) {
      interaction = interact(ref.current)
      if (options) {
        const { draggable, resizable, droppable } = options
        if (draggable) {
          interaction
            .on('dragend', (event: InteractEvent) => {
              draggable.onDragEnd(event.target.id)
            })
            .draggable({
              manualStart: !!options.draggable?.manualStart,
              inertia: false,
              autoScroll: true,
              listeners: {
                start: (event: InteractEvent) => {
                  /**
                   * we are going to move the element to the root of the drag holder
                   * so that it will be rendered on top of the other objects to maintain
                   * visibility
                   */
                  const boundingClient = event.target.getBoundingClientRect()

                  const target = event.target
                  if (!target) {
                    return
                  }
                  event.target.dataset['originaltop'] = event.target.style.top
                  event.target.dataset['originalleft'] = event.target.style.left
                  updateAttribues(target, 0, 0)
                  if (
                    event.target.classList.contains('root-element') &&
                    event.target.id !== 'new-element'
                  ) {
                    return
                  }
                  if (target.parentElement) {
                    target.parentElement.id = 'drag-and-drop-origin'
                    document.getElementById('drag-holder')?.appendChild(target)
                    const z = parseFloat(
                      document
                        .getElementById('objectCollection')
                        ?.getAttribute('data-z') || '1'
                    )
                    const [canvasX, canvasY] = getDataAttributes(
                      document.getElementById('objectCollection')!
                    )
                    updateAttribues(
                      target,
                      (boundingClient.x - canvasX) / z,
                      (boundingClient.y - canvasY) / z
                    )
                    target.style.left = `0px`
                    target.style.top = `0px`
                  }
                },
                move: event => {
                  const [x, y] = getDataAttributes(event.target)
                  const z = parseFloat(
                    document
                      .getElementById('objectCollection')
                      ?.getAttribute('data-z') || '1'
                  )
                  updateAttribues(
                    event.target,
                    x + event.dx / z,
                    y + event.dy / z
                  )
                },
              },
            })
          if (draggable.manualStart) {
            interaction.on('move', (event: InteractEvent) => {
              if (
                event.interaction.pointerIsDown &&
                !event.interaction.interacting()
              ) {
                event.interaction.start(
                  { name: 'drag' },
                  event.interactable,
                  ref.current!
                )
              }
            })
          }
        }
        if (resizable) {
          interaction
            .on('resizeend', (event: InteractEvent) => {
              var target = event.target
              const [x, y] = getDataAttributes(target)
              const [left, top] = getPosition(target)
              updateAttribues(target, 0, 0)
              updatePosition(target, x + left, y + top)
              resizable.onResizeEnd(
                id,
                {
                  width: parseFloat(target.style.width),
                  height: parseFloat(target.style.height),
                },
                { x: x + left, y: y + top }
              )
            })
            .resizable({
              // resize from all edges and corners
              edges: { left: false, right: true, bottom: true, top: false },
              listeners: {
                move(event) {
                  var target = event.target
                  let [x, y] = getDataAttributes(target)

                  const z = parseFloat(
                    document
                      .getElementById('objectCollection')
                      ?.getAttribute('data-z') || '1'
                  )
                  // update the element's style
                  target.style.width = event.rect.width / z + 'px'
                  target.style.height = event.rect.height / z + 'px'

                  // translate when resizing from top or left edges
                  x += event.deltaRect.left / z
                  y += event.deltaRect.top / z

                  updateAttribues(target, x, y)
                },
              },

              inertia: false,
            })
        }
        if (droppable) {
          interaction.dropzone({
            accept: '.droppable',
            overlap: 0.75,
            ondropactivate: event => event.target.classList.add('drop-active'),
            ondragenter: event => event.target.classList.add('drop-target'),
            ondragleave: event => event.target.classList.remove('drop-target'),
            ondropdeactivate: function (event) {
              event.target.classList.remove('drop-active')
              event.target.classList.remove('drop-target')
            },
            ondrop: function (event: InteractEvent) {
              /**
               * Drop rules
               * 1. Only a root component can be placed on the main-canvas
               * 2. Only containers or the main canvas can be dropped on
               */
              if (!event.relatedTarget) {
                return
              }
              const parentId = event.target.id
              const isRootElement =
                event.relatedTarget.classList.contains('root-element')
              // put the component back in the proper DOM location so react doesn't complain
              const dndOrigin = document.getElementById('drag-and-drop-origin')
              if (dndOrigin) {
                dndOrigin.id = ''
                dndOrigin.appendChild(event.relatedTarget)
              }
              // check if we need to update the component
              let parent = event.target
              let [positionX, positionY] = getPosition(parent)
              while (
                parent.parentElement &&
                !parent.classList.contains('root-element')
              ) {
                parent = parent.parentElement
                const [parentX, parentY] = getPosition(parent)
                positionX += parentX
                positionY += parentY
              }
              const [x, y] = getDataAttributes(event.relatedTarget)
              const [left, top] = getPosition(event.relatedTarget)
              const newX = x + left - positionX
              const newY = y + top - positionY

              if (event.relatedTarget.id === 'new-element') {
                // check if we need to insert the component
                if (!isRootElement && parentId === 'main-canvas') {
                  return
                }
                const layer = event.relatedTarget.dataset['layer']
                if (layer) {
                  const jsonLayer = JSON.parse(layer)
                  updateAttribues(event.relatedTarget, 0, 0)
                  updatePosition(event.relatedTarget, newX, newY)
                  const targetId =
                    parentId === 'main-canvas' ? undefined : parentId
                  createComponent({
                    name: jsonLayer.type,
                    componentType: jsonLayer.componentType,
                    package: jsonLayer.package,
                    type: jsonLayer.type,
                    parent: targetId,
                    props: jsonLayer.props,
                    layout: jsonLayer.layout,
                    data: jsonLayer.data,
                    layerSort: LexoRankHelper.generateNewLexoRanking(),
                    x: newX,
                    y: newY,
                  })
                }
              } else {
                updatePosition(event.relatedTarget, newX, newY)
                const targetId =
                  parentId === 'main-canvas' ? undefined : parentId
                updateAttribues(event.relatedTarget, 0, 0)
                updateComponent(
                  event.relatedTarget.id,
                  {
                    parent: targetId,
                    x: newX,
                    y: newY,
                  },
                  {
                    parent: event.relatedTarget.dataset['parentid'],
                    x: parseFloat(
                      event.relatedTarget.dataset['originalleft'] || '0'
                    ),
                    y: parseFloat(
                      event.relatedTarget.dataset['originaltop'] || '0'
                    ),
                  }
                )
              }
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
  return {
    ref,
  }
}
