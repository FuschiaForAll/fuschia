import React, { useContext, useCallback } from 'react'
import styled from '@emotion/styled'
import type { Layer as LayerType, Page as PageType } from '@fuchsia/types'
import Page from './Page'
import CanvasContext from '../../canvas-context'

interface LayerProps {
  layer: LayerType
}

const LayerWrapper = styled.div`
  pointer-events: all;
`

const LayerSub: React.FC<LayerProps> = function LayerSub({ layer }) {
  const {
    state: { selection },
  } = useContext(CanvasContext)

  const selected = selection?.includes(layer.id)

  switch (layer.layerType) {
    case 'page':
      return <Page layer={layer as PageType} selected={selected} />
    default:
      return <h2>Hello Layer</h2>
  }
}

const Layer: React.FC<LayerProps> = function Layer({ layer }) {
  const { onChange: setCanvasState, state: canvasState } =
    useContext(CanvasContext)

  const handleSelect = useCallback(() => {
    setCanvasState({
      ...canvasState,
      selection: [layer.id],
    })
  }, [layer.id, canvasState, setCanvasState])

  return (
    <LayerWrapper onMouseDown={handleSelect}>
      <LayerSub layer={layer} />
    </LayerWrapper>
  )
}

export default Layer
