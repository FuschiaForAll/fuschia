import React, { useState, useCallback, useEffect, useContext } from 'react'
import shortUUID from 'short-uuid'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import AppsIcon from '@mui/icons-material/Apps'
import Crop32Icon from '@mui/icons-material/Crop32'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'
import ImageIcon from '@mui/icons-material/Image'
import type { Layer as LayerType, Page } from '@fuchsia/types'

// import CanvasContext from '../canvas-context'
// import AppContext from '../context'
import Icon from '../../Shared/Icon'
import Item from './Item'
import Layer from '../Canvas/Layer'
import AppContext from '../context'
import CanvasContext from '../canvas-context'

interface ToolProps {
  defaultLayer: LayerType
}

interface DragEvent {
  position: [number, number] | null
}

interface DragItemProps {
  drag: DragEvent
  layer: LayerType
  onDrag: (evt: MouseEvent) => void
  onDragEnd: (evt: MouseEvent) => void
}

const PAGE: Page = {
  id: '',
  type: 'layer',
  layerType: 'page',
  name: 'Screen 1',
  x: 0,
  y: 0,
  width: 375,
  height: 667,
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
  drag,
  layer,
  onDrag,
  onDragEnd,
}) {
  useEffect(() => {
    document.body.addEventListener('mousemove', onDrag)

    return () => {
      document.body.removeEventListener('mousemove', onDrag)
    }
  }, [onDrag])

  useEffect(() => {
    document.body.addEventListener('mouseup', onDragEnd)

    return () => {
      document.body.removeEventListener('mouseup', onDragEnd)
    }
  }, [onDragEnd])

  if (!drag.position) {
    return null
  }

  const [x, y] = drag.position

  const styles: React.CSSProperties = { left: x, top: y }

  if (layer.layerType === 'page') {
    const { width, height } = layer as Page

    styles.width = width
    styles.height = height
    styles.marginLeft = -width / 2
    styles.marginTop = -height / 2
  }

  return (
    <DragContainer>
      <DragLayer style={styles}>
        <Layer layer={layer} />
      </DragLayer>
    </DragContainer>
  )
}

const Tool: React.FC<ToolProps> = function Tool({ defaultLayer, children }) {
  const [drag, setDrag] = useState<DragEvent | null>(null)

  const startDrag = useCallback(() => {
    setDrag({ position: null })
  }, [])

  const { body, setBody } = useContext(AppContext)

  const { onChange: setCanvasState, state: canvasState } =
    useContext(CanvasContext)

  const handleDrag = useCallback((evt: MouseEvent) => {
    const x = evt.clientX
    const y = evt.clientY

    setDrag({
      position: [x, y],
    })
  }, [])

  const handleDragEnd = useCallback(() => {
    if (drag?.position) {
      let [x, y] = drag.position
      const id = shortUUID.generate()

      if (defaultLayer.layerType === 'page') {
        const { width, height } = defaultLayer as Page

        x -= width / 2
        y -= height / 2
      }

      setBody({
        ...body,
        objects: body.objects.concat([
          { ...defaultLayer, id, x, y } as LayerType,
        ]),
      })

      setCanvasState({
        ...canvasState,
        selection: [id],
      })
    }

    setDrag(null)
  }, [drag, body, setBody, defaultLayer, canvasState, setCanvasState])

  return (
    <>
      <Item onDrag={startDrag}>{children}</Item>
      {drag && (
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
  return (
    <Paper elevation={12} sx={cardStyles}>
      <Item>
        <AppsIcon />
      </Item>
      <Item>
        <FormatColorTextIcon />
      </Item>
      <Item>
        <ImageIcon />
      </Item>
      <Item>
        <Icon icon="shapes" />
      </Item>
      <Item>
        <Icon icon="expandRight" />
      </Item>
      <Item>
        <Icon icon="input" />
      </Item>
      <Tool defaultLayer={PAGE}>
        <Crop32Icon />
      </Tool>
    </Paper>
  )
}

export default Toolbar
