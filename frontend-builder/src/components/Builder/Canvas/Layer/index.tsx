import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'

import { useSelection, Selection, useDragDrop } from '../../../../utils/hooks'
import { arrayXor } from '../../../../utils/arrays'
import {
  Component,
  useUpdateComponentMutation,
} from '../../../../generated/graphql'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 2rem;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Inner = styled.div`
  width: 300px;
  height: 100%;
  padding-top: calc(56px + 1rem);
  padding-bottom: calc(56px + 1rem);
`

const cardStyles = {
  height: '100%',
  padding: '0.5rem',
  margin: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'all',
}

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
    width: jsonProps.width || 50,
    height: jsonProps.height || 50,
    left: x || 0,
    top: y || 0,
    pointerEvents: 'all',
    position: 'absolute',
    zIndex: 10,
  }

  if (selected) {
    styles.boxShadow = BOX_SHADOW
  }
  const classNames = ['droppable']
  if (layer.isRootElement) {
    classNames.push('root-element')
  }
  return (
    <FrameWrapper
      id={layer._id}
      className={classNames.join(' ')}
      style={styles}
      ref={ref}
      onClick={onClick}
      data-package={layer.package}
      data-type={layer.type}
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
  const jsonProps = JSON.parse(props || '{}')
  const styles: React.CSSProperties = {
    width: jsonProps.width || 50,
    height: jsonProps.height || 50,
    pointerEvents: 'all',
    zIndex: 1000,
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
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
      data-package={layer.package}
      data-type={layer.type}
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
  const WrapperType = layer.isContainer ? FrameLayer : InlineLayer
  const { props } = layer
  const jsonProps = JSON.parse(props || '{}')
  return (
    <WrapperType layer={layer} selected={selected} onClick={onSelect}>
      {layer.isContainer ? (
        <InlineComponent
          id={`component=${layer._id}`}
          {...jsonProps}
          style={{
            ...jsonProps.style,
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          {layer.children?.map(child => (
            <LayerSub layer={child} selection={selection} onSelect={onSelect} />
          ))}
        </InlineComponent>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        >
          <InlineComponent
            id={`component=${layer._id}`}
            {...jsonProps}
            style={{
              ...jsonProps.style,
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(254, 254, 254, 0.1)',
            }}
          />
        </div>
      )}
    </WrapperType>
  )
}

const Layer: React.FC<LayerProps> = function Layer({ layer }) {
  const { selection, setSelection } = useSelection()

  const handleSelect = useCallback<ClickHandler>(
    e => {
      e.stopPropagation()
      if (e.shiftKey) {
        setSelection(arrayXor(selection, e.currentTarget.id))
      } else if (!selection?.includes(e.currentTarget.id)) {
        setSelection([e.currentTarget.id])
      }
    },
    [selection, setSelection]
  )
  return (
    <LayerSub layer={layer} selection={selection} onSelect={handleSelect} />
  )
}

export default Layer
