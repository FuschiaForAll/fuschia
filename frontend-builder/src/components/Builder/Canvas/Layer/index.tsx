import React, { useCallback } from 'react'
import styled from '@emotion/styled'

import type {
  Layer as LayerType,
  Page as PageType,
  Frame,
  TextType,
} from '@fuchsia/types'

import Page from './Page'
import TextLayer from './Text'
import { useSelection, Selection } from '../../../../utils/hooks'
import { arrayXor } from '../../../../utils/arrays'

type ClickHandler = React.MouseEventHandler<HTMLDivElement>

interface LayerProps {
  layer: LayerType
  selection?: Selection
  onSelect?: ClickHandler
}

interface InlineProps {
  selected: boolean
  onClick?: ClickHandler
}

interface FrameProps extends InlineProps {
  layer: Frame
}

const BOX_SHADOW = '0 0 0 2px var(--primary)'

const FrameWrapper = styled.div`
  pointer-events: all;
  position: absolute;
`

const InlineWrapper = styled.div`
  pointer-events: all;
`

const FrameLayer: React.FC<FrameProps> = function AbsoluteLayer({
  layer,
  children,
  selected,
  onClick,
}) {
  const { x, y, width, height } = layer

  const styles: React.CSSProperties = {
    width,
    height,
    left: x,
    top: y,
  }

  if (selected) {
    styles.boxShadow = BOX_SHADOW
  }

  return (
    <FrameWrapper style={styles} onClick={onClick}>
      {children}
    </FrameWrapper>
  )
}

const InlineLayer: React.FC<InlineProps> = function InlineLayer({
  children,
  selected,
  onClick,
}) {
  const styles: React.CSSProperties = {}

  if (selected) {
    styles.boxShadow = BOX_SHADOW
  }

  return (
    <InlineWrapper style={styles} onClick={onClick}>
      {children}
    </InlineWrapper>
  )
}

const LayerSub: React.FC<LayerProps> = function LayerSub({
  layer,
  selection,
  onSelect,
}) {
  const selected = !!selection?.includes(layer.id)

  switch (layer.layerType) {
    case 'page':
      return (
        <FrameLayer
          layer={layer as Frame}
          selected={selected}
          onClick={onSelect}
        >
          <Page layer={layer as PageType} />
        </FrameLayer>
      )
    case 'text':
      return (
        <InlineLayer selected={selected} onClick={onSelect}>
          <TextLayer layer={layer as TextType} />
        </InlineLayer>
      )
    default:
      // @ts-ignore
      if (!window[layer.layerType]) {
        return (
          <InlineLayer selected={selected} onClick={onSelect}>
            <div>Missing Bundle</div>
          </InlineLayer>
        )
      }
      // @ts-ignore
      const InlineComponent = window[layer.layerType].components[layer.name]
      return (
        <InlineLayer selected={selected} onClick={onSelect}>
          <InlineComponent title="Hello World" text="Hello World" />
        </InlineLayer>
      )
  }
}

const Layer: React.FC<LayerProps> = function Layer({ layer }) {
  const { selection, setSelection } = useSelection()

  const handleSelect = useCallback<ClickHandler>(
    e => {
      if (e.shiftKey) {
        setSelection(arrayXor(selection, layer.id))
      } else if (!selection?.includes(layer.id)) {
        setSelection([layer.id])
      }
    },
    [layer.id, selection, setSelection]
  )

  return (
    <LayerSub layer={layer} selection={selection} onSelect={handleSelect} />
  )
}

export default Layer
