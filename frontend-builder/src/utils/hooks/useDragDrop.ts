import React, { useRef, useEffect } from 'react'
import interact from 'interactjs'
import { Interactable, InteractEvent, Element } from '@interactjs/types'
import { useParams } from 'react-router-dom'
import { useDeleteComponents } from './useDeleteComponents'
import { useUpdateComponent } from './useUpdateComponent'
import { useInsertComponent } from './useInsertComponent'
import { Schema } from '@fuchsia/types'

interface DragResponse {
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

function getDefaultProps(schema: Schema, acc: object) {
  debugger
  if (schema.type === 'object') {
    return Object.keys(schema.properties).reduce((obj, key) => {
      obj[key] = getDefaultProps(schema.properties[key], { [key]: {} })
      return obj
    }, {} as any)
  }
  return schema.default
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

export const useDragDrop = (
  id: string,
  options?: DragDropOptions
): DragResponse => {
  const { projectId } = useParams()
  const createComponent = useInsertComponent()
  const deleteComponents = useDeleteComponents()
  const updateComponent = useUpdateComponent()
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
              var target = event.target
              if (target.classList.contains('deleted')) {
                return
              }
              const [x, y] = getDataAttributes(target)
              const [left, top] = getPosition(target)
              updatePosition(target, x + left, y + top)
              updateComponent(id, { x: x + left, y: y + top })
            })
            .draggable({
              inertia: false,
              autoScroll: true,
              listeners: {
                start: event => {
                  const target = event.target
                  updateAttribues(target, 0, 0)
                  if (event.target.classList.contains('root-element')) {
                    return
                  }
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
                    (event.x0 - canvasX) / z,
                    (event.y0 - canvasY) / z
                  )
                  target.style.left = 0
                  target.style.top = 0
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
                { width: target.style.width, height: target.style.height },
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
              modifiers: [
                interact.modifiers.restrictSize({
                  min: { width: 100, height: 50 },
                }),
              ],

              inertia: false,
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
              var dropzoneElement = event.target
              dropzoneElement.classList.add('drop-target')
            },
            ondragleave: function (event) {
              event.target.classList.remove('drop-target')
            },
            ondrop: function (event) {
              const parentId = event.target.id
              // temp
              if (parentId === 'drag-holder') {
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
                    deleteComponents(event.relatedTarget.id)
                  }
                } else {
                  // it is a root element, update location
                  const [x, y] = getDataAttributes(event.relatedTarget)
                  const [left, top] = getPosition(event.relatedTarget)
                  updateAttribues(event.relatedTarget, 0, 0)
                  updatePosition(event.relatedTarget, x + left, y + top)
                }
                return
              }
              if (event.relatedTarget.id === 'new-element') {
                // insert component
                document
                  .getElementById('toolbar')
                  ?.appendChild(event.relatedTarget)
                const layer = event.relatedTarget.dataset['layer']
                if (layer) {
                  const jsonLayer = JSON.parse(layer)

                  const [parentX, parentY] = getPosition(event.target)
                  const [x, y] = getDataAttributes(event.relatedTarget)
                  const [left, top] = getPosition(event.relatedTarget)
                  const newX = x + left - parentX
                  const newY = y + top - parentY
                  updateAttribues(event.relatedTarget, 0, 0)
                  updatePosition(event.relatedTarget, newX, newY)
                  const targetId =
                    parentId === 'main-canvas' ? undefined : parentId
                  createComponent({
                    isRootElement: jsonLayer.isRootElement,
                    isContainer: jsonLayer.isContainer,
                    package: jsonLayer.package,
                    type: jsonLayer.type,
                    parent: targetId,
                    props: JSON.stringify(
                      getDefaultProps(JSON.parse(jsonLayer.props), {})
                    ),
                    x: newX,
                    y: newY,
                  })
                }
              } else {
                const parentdnd = document.getElementById(
                  'drag-and-drop-origin'
                )
                if (parentdnd) {
                  parentdnd.id = ''
                  parentdnd.appendChild(event.relatedTarget)
                }
                // adjust to be relative to drop parent
                const [parentX, parentY] = getPosition(event.target)
                const [x, y] = getDataAttributes(event.relatedTarget)
                const [left, top] = getPosition(event.relatedTarget)
                updatePosition(
                  event.relatedTarget,
                  x + left - parentX,
                  y + top - parentY
                )
                updateAttribues(event.relatedTarget, 0, 0)
                updateComponent(event.relatedTarget.id, {
                  parent: parentId,
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
  return {
    ref,
  }
}
