import React, { useState, useCallback, useEffect, useRef } from 'react'
import Paper from '@mui/material/Paper'
import { useParams } from 'react-router-dom'
import Item from './Item'
import { useGetPackagesQuery } from '../../../generated/graphql-packages'
import {
  Component,
  useCreateComponentMutation,
} from '../../../generated/graphql'
import { gql } from '@apollo/client'
import interact from 'interactjs'
import { Interactable, InteractEvent } from '@interactjs/types'
import * as MaterialIcons from '@mui/icons-material'
interface ToolProps {
  defaultLayer: Component & { isRootElement: boolean }
}

interface DragEvent {
  position: [number, number]
}

interface DragItemProps {
  drag: DragEvent
  layer: Component & { isRootElement: boolean }
  onDrag: (evt: MouseEvent) => void
  onDragEnd: () => void
}

const cardStyles = {
  padding: '0.5rem 0',
  margin: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pointerEvents: 'all',
}

const DragItem: React.FC<DragItemProps> = function DragItem({
  layer,
  drag,
  onDrag,
  onDragEnd,
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { projectId } = useParams()
  const { props } = layer
  const jsonProps = JSON.parse(props || '{}')
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
                  isRootElement
                  isContainer
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
  useEffect(() => {
    let interaction: Interactable
    if (ref.current) {
      interaction = interact(ref.current)
      interaction
        .on('dragend', async (event: InteractEvent) => {
          if (layer.isRootElement) {
            var target = event.target
            let x =
              (parseFloat(target.style.left) || 0) +
                parseFloat(target.getAttribute('data-x')!) || 0
            let y =
              (parseFloat(target.style.top) || 0) +
                parseFloat(target.getAttribute('data-y')!) || 0
            target.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)'
            target.setAttribute('data-x', '0px')
            target.setAttribute('data-y', '0px')
            target.style.left = `${x}px`
            target.style.top = `${y}px`
          }
          onDragEnd()
        })
        .on('move', (event: InteractEvent) => {
          var interaction = event.interaction
          if (!interaction.interacting()) {
            const x = event.x0 + parseFloat(jsonProps.width || '0') / 2
            const y = event.y0 + parseFloat(jsonProps.height || '0') / 2

            event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
            event.target.setAttribute('data-x', `${x}`)
            event.target.setAttribute('data-y', `${y}`)
            interaction.start(
              { name: 'drag' },
              event.interactable,
              event.currentTarget
            )
          }
        })
        .draggable({
          manualStart: true,
          inertia: true,
          modifiers: [],
          autoScroll: true,
          listeners: {
            start: event => {
              document.getElementById('drag-holder')?.appendChild(event.target)
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
    return () => interaction.unset()
  }, [createComponent, jsonProps, layer, projectId, onDragEnd])

  const styles: React.CSSProperties = {
    width: 50,
    height: 50,
    pointerEvents: 'all',
    position: 'fixed',
    zIndex: 1000,
  }
  if (jsonProps) {
    styles.width = jsonProps?.width || 50
    styles.height = jsonProps?.height || 50
    styles.left = `${
      drag.position[0] - parseFloat(jsonProps.width || '0') / 2
    }px`
    styles.top = `${
      drag.position[1] - parseFloat(jsonProps.height || '0') / 2
    }px`
  }
  // @ts-ignore
  const InlineComponent = window[layer.package].components[layer.type]
  return (
    <div
      className={`droppable ${layer.isRootElement ? 'root-element' : ''}`}
      id="new-element"
      data-parent="toolbar"
      ref={ref}
      style={styles}
      data-layer={JSON.stringify(layer)}
    >
      <InlineComponent {...jsonProps} />
    </div>
  )
}

const Tool: React.FC<ToolProps> = function Tool({ defaultLayer, children }) {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [drag, setDrag] = useState<DragEvent>({ position: [0, 0] })
  const dragging = !!drag && dragActive

  const startDrag = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setDrag({ position: [event.clientX, event.clientY] })
      setDragActive(true)
    },
    []
  )

  const handleDrag = useCallback(
    (evt: MouseEvent) => {
      const x = evt.clientX
      const y = evt.clientY

      if (dragging) {
        setDrag({
          position: [x, y],
        })
      }
    },
    [dragging]
  )

  const handleDragEnd = useCallback(() => {
    setDragActive(false)
  }, [])

  return (
    <>
      <Item title={defaultLayer.type} onDrag={startDrag}>
        <>{children}</>
      </Item>
      {dragActive && (
        <DragItem
          drag={drag}
          layer={defaultLayer}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        />
      )}
    </>
  )
}

const Toolbar: React.FC = function Toolbar() {
  const { data: packageData } = useGetPackagesQuery({
    context: {
      clientName: 'package-manager',
    },
  })
  return (
    <Paper elevation={12} sx={cardStyles} id="toolbar">
      {packageData &&
        packageData.getPackages.flatMap(_package => {
          return _package.components.map(component => {
            return (
              <Tool
                key={component._id}
                defaultLayer={{
                  isContainer: component.isContainer,
                  isRootElement: component.isRootElement,
                  package: _package.packageName,
                  _id: '',
                  type: component.name,
                  props: component.defaultValue,
                }}
              >
                {/* @ts-ignore */}
                {MaterialIcons[component.icon] &&
                  // @ts-ignore
                  React.createElement(MaterialIcons[component.icon], {
                    color: 'primary',
                  })}
              </Tool>
            )
          })
        })}
    </Paper>
  )
}

export default Toolbar
