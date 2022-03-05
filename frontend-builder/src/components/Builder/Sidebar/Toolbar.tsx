import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react'
import shortUUID from 'short-uuid'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import AppsIcon from '@mui/icons-material/Apps'
import ImageIcon from '@mui/icons-material/Image'
import { useParams } from 'react-router-dom'
import AppContext from '../../../utils/app-context'
import CanvasContext from '../../../utils/canvas-context'
import Icon from '../../Shared/Icon'
import Item from './Item'
import Layer from '../Canvas/Layer'
import { useGetPackagesQuery } from '../../../generated/graphql-packages'
import {
  Component,
  useCreateComponentMutation,
} from '../../../generated/graphql'
import { gql } from '@apollo/client'
import { useDragDrop } from '../../../utils/hooks'
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

const DragContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
`

const DragLayer = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -150px;
  margin-top: -150px;
`

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
            await createComponent({
              variables: {
                projectId,
                componentInput: {
                  package: layer.package,
                  type: layer.type,
                  x,
                  y,
                  props: layer.props,
                },
              },
            })
          }
          onDragEnd()
        })
        .on('move', (event: InteractEvent) => {
          var interaction = event.interaction
          if (!interaction.interacting()) {
            const x = event.x0 + parseFloat(jsonProps.style.width || '0') / 2
            const y = event.y0 + parseFloat(jsonProps.style.height || '0') / 2

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
  }, [createComponent, layer, projectId, onDragEnd])

  const { props } = layer

  const styles: React.CSSProperties = {
    width: 50,
    height: 50,
    pointerEvents: 'all',
    position: 'fixed',
  }
  const jsonProps = JSON.parse(props || '{}')
  if (jsonProps.style) {
    styles.width = jsonProps.style.width
    styles.height = jsonProps.style.height
    styles.left = `${
      drag.position[0] - parseFloat(jsonProps.style.width || '0') / 2
    }px`
    styles.top = `${
      drag.position[1] - parseFloat(jsonProps.style.height || '0') / 2
    }px`
  }
  // @ts-ignore
  const InlineComponent = window[layer.package].components[layer.type]

  return (
    <div
      className="droppable"
      id="new-element"
      ref={ref}
      style={styles}
      data-layer={JSON.stringify(layer)}
    >
      <InlineComponent
        {...jsonProps}
        style={{ ...jsonProps.style, width: '100%', height: '100%' }}
      />
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
    // if (drag?.position) {
    //   let [x, y] = drag.position
    //   const id = shortUUID.generate()
    //   const { props } = defaultLayer
    //   const jsonProps = JSON.parse(props || '{}')
    //   x -= parseFloat(jsonProps.style.width || '0') / 2
    //   y -= parseFloat(jsonProps.style.height || '0') / 2
    //   createComponent({
    //     variables: {
    //       projectId,
    //       componentInput: {
    //         package: defaultLayer.package,
    //         type: defaultLayer.type,
    //         x,
    //         y,
    //         props,
    //       },
    //     },
    //   })

    //   setCanvasState({
    //     ...canvasState,
    //     selection: [id],
    //   })
    // }
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
    <Paper elevation={12} sx={cardStyles}>
      <Item title="Something">
        <AppsIcon />
      </Item>
      {/* <Tool defaultLayer={TEXT}>
        <FormatColorTextIcon />
      </Tool> */}
      {packageData &&
        packageData.getPackages.flatMap(_package => {
          return _package.components.map(component => {
            return (
              <Tool
                key={component._id}
                defaultLayer={{
                  isRootElement: component.isRootElement,
                  package: _package.packageName,
                  _id: '',
                  type: component.name,
                  props: component.props,
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
      <Item title="image">
        <ImageIcon />
      </Item>
      <Item title="shapes">
        <Icon icon="shapes" />
      </Item>
      <Item title="expandRight">
        <Icon icon="expandRight" />
      </Item>
      <Item title="input">
        <Icon icon="input" />
      </Item>
      {/* <Tool defaultLayer={PAGE}>
        <Crop32Icon />
      </Tool> */}
    </Paper>
  )
}

export default Toolbar
