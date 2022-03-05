import React, { useCallback } from 'react'
import styled from '@emotion/styled'

import { useSelection, Selection, useDragDrop } from '../../../../utils/hooks'
import { arrayXor } from '../../../../utils/arrays'
import {
  Component,
  useUpdateComponentMutation,
} from '../../../../generated/graphql'

type ClickHandler = React.MouseEventHandler<HTMLDivElement>

interface LayerProps {
  layer: Component
  selection?: Selection
  onSelect?: ClickHandler
}

interface InlineProps {
  layer: Component
  selected: boolean
  onClick?: ClickHandler
}

interface FrameProps extends InlineProps {
  layer: Component
}

const BOX_SHADOW = '0 0 0 2px var(--primary)'

const FrameWrapper = styled.div`
  pointer-events: all;
  position: absolute;
`

const InlineWrapper = styled.div`
  pointer-events: all;
  position: 'absolute';
`

const FrameLayer: React.FC<FrameProps> = function AbsoluteLayer({
  layer,
  children,
  selected,
  onClick,
}) {
  const { x, y, props } = layer
  const jsonProps = JSON.parse(props || '{}')
  console.log(`FrameLayer here for: ${layer._id}`)
  const [updateComponent] = useUpdateComponentMutation()
  const { ref } = useDragDrop(layer._id, {
    draggable: {
      onDragEnd: (id, { x, y }) => {
        updateComponent({
          variables: {
            componentId: id,
            componentInput: {
              x,
              y,
            },
          },
        })
      },
    },
    resizable: {
      onResizeEnd: (id, { width, height }, { x, y }) => {
        updateComponent({
          variables: {
            componentId: id,
            componentInput: {
              x,
              y,
              props: JSON.stringify({
                ...jsonProps,
                style: { width, height },
              }),
            },
          },
        })
      },
    },
    droppable: {
      dropClass: '#droppable',
      onDrop: () => {},
    },
  })

  const styles: React.CSSProperties = {
    width: 50,
    height: 50,
    left: x || 0,
    top: y || 0,
    pointerEvents: 'all',
    position: 'absolute',
  }

  if (jsonProps.style) {
    styles.width = jsonProps.style.width
    styles.height = jsonProps.style.height
  }

  if (selected) {
    styles.boxShadow = BOX_SHADOW
  }

  return (
    <FrameWrapper
      id={layer._id}
      className="droppable"
      style={styles}
      ref={ref}
      onClick={onClick}
    >
      {children}
    </FrameWrapper>
  )
}

export const InlineLayer: React.FC<InlineProps> = function InlineLayer({
  layer,
  children,
  selected,
  onClick,
}) {
  const [updateComponent] = useUpdateComponentMutation()
  const { ref } = useDragDrop(layer._id, {
    draggable: {
      onDragEnd: (id, { x, y }) => {
        updateComponent({
          variables: {
            componentId: id,
            componentInput: {
              x,
              y,
            },
          },
        })
      },
    },
    resizable: {
      onResizeEnd: (id, { width, height }, { x, y }) => {
        updateComponent({
          variables: {
            componentId: id,
            componentInput: {
              x,
              y,
              props: JSON.stringify({
                ...jsonProps,
                style: { width, height },
              }),
            },
          },
        })
      },
    },
  })
  const { x, y, props } = layer
  const styles: React.CSSProperties = {
    width: 50,
    height: 50,
    pointerEvents: 'all',
  }
  const jsonProps = JSON.parse(props || '{}')
  if (jsonProps.style) {
    styles.width = jsonProps.style.width
    styles.height = jsonProps.style.height
  }
  if (selected) {
    styles.boxShadow = BOX_SHADOW
  }

  return (
    <div
      className="droppable"
      id={layer._id}
      ref={ref}
      style={styles}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const LayerSub: React.FC<LayerProps> = function LayerSub({
  layer,
  selection,
  onSelect,
}) {
  const selected = !!selection?.includes(layer._id)

  // @ts-ignore
  if (!window[layer.package]) {
    return (
      <InlineLayer layer={layer} selected={selected} onClick={onSelect}>
        <div>Missing Package</div>
      </InlineLayer>
    )
  }
  // @ts-ignore
  const InlineComponent = window[layer.package].components[layer.type]
  const WrapperType = layer.parent ? InlineLayer : FrameLayer

  const { props } = layer
  const jsonProps = JSON.parse(props || '{}')
  return (
    <WrapperType layer={layer} selected={selected} onClick={onSelect}>
      <InlineComponent
        {...jsonProps}
        style={{ ...jsonProps.style, width: '100%', height: '100%' }}
      >
        {layer.children?.map(child => (
          <LayerSub layer={child} selection={selection} onSelect={onSelect} />
        ))}
      </InlineComponent>
    </WrapperType>
  )
}

const Layer: React.FC<LayerProps> = function Layer({ layer }) {
  const { selection, setSelection } = useSelection()

  const handleSelect = useCallback<ClickHandler>(
    e => {
      if (e.shiftKey) {
        setSelection(arrayXor(selection, layer._id))
      } else if (!selection?.includes(layer._id)) {
        setSelection([layer._id])
      }
    },
    [layer._id, selection, setSelection]
  )
  return (
    <LayerSub layer={layer} selection={selection} onSelect={handleSelect} />
  )
}

export default Layer
