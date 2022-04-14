import React, { useState, useCallback } from 'react'
import Paper from '@mui/material/Paper'
import Item from './Item'
import {
  PackageComponentType,
  useGetPackagesQuery,
} from '../../../generated/graphql'
import * as MaterialIcons from '@mui/icons-material'
import { useDragDrop } from '../../../utils/hooks'
import { StructuredComponent } from '../../../utils/hooks/useProjectComponents'
interface ToolProps {
  defaultLayer: StructuredComponent
}

interface DragEvent {
  position: [number, number]
}

interface DragItemProps {
  drag: DragEvent
  layer: StructuredComponent
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
  gap: '1em',
}

const DragItem: React.FC<DragItemProps> = function DragItem({
  layer,
  drag,
  onDrag,
  onDragEnd,
}) {
  const { ref } = useDragDrop('new-element', {
    draggable: {
      onDragEnd,
      manualStart: true,
    },
  })
  const styles: React.CSSProperties = {
    width: 50,
    height: 50,
    pointerEvents: 'all',
    position: 'fixed',
    zIndex: 1000,
  }
  styles.width = layer.props?.style?.width || 50
  styles.height = layer.props?.style?.height || 50
  styles.left = `${
    drag.position[0] - parseFloat(layer.props?.style?.width || '0') / 2
  }px`
  styles.top = `${
    drag.position[1] - parseFloat(layer.props?.style?.height || '0') / 2
  }px`

  const props = { ...layer.props }
  // @ts-ignore
  const InlineComponent = window[layer.package][layer.type]
  if (layer.data) {
    if (layer.data) {
      Object.keys(layer.data).forEach(key => {
        props[key] = {
          onChange: (e: any) => {},
        }
      })
    }
  }
  return (
    <div
      className={`droppable ${
        layer.componentType === PackageComponentType.Stack ||
        layer.componentType === PackageComponentType.Screen
          ? 'root-element'
          : ''
      }`}
      id="new-element"
      data-parent="toolbar"
      ref={ref}
      style={styles}
      data-layer={JSON.stringify(layer)}
    >
      <InlineComponent {...props} />
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
        <div>
          <DragItem
            drag={drag}
            layer={defaultLayer}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          />
        </div>
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
                  name: component.name,
                  componentType: component.componentType,
                  package: _package.packageName,
                  _id: '',
                  type: component.name,
                  props: component.defaultValue,
                  data: component.schema.data,
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
