import React, { useCallback } from 'react'
import styled from '@emotion/styled'

import { useSelection, Selection, useDragDrop } from '../../../../utils/hooks'
import { arrayXor } from '../../../../utils/arrays'
import {
  Component,
  useUpdateComponentMutation,
} from '../../../../generated/graphql'
import PropertyWindow from '../../Properties'
import {
  GetPackagesQuery,
  useGetPackagesQuery,
} from '../../../../generated/graphql-packages'
import { Schema } from '@fuchsia/types'
import Portal from '../../../Shared/Portal'

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
  const [updateComponent] = useUpdateComponentMutation()
  const { ref } = useDragDrop(layer._id, {
    draggable: {
      onDragEnd: id => {},
    },
    resizable: {
      onResizeEnd: (id, { width, height }, { x, y }) => {
        updateComponent({
          variables: {
            componentId: id,
            componentInput: {
              x,
              y,
              props: {
                ...props,
                style: { width, height },
              },
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
    width: props.style?.width || 50,
    height: props.style?.height || 50,
    left: x || 0,
    top: y || 0,
    pointerEvents: 'all',
    position: 'absolute',
    zIndex: 10,
  }

  if (selected) {
    styles.boxShadow = BOX_SHADOW
  }

  if (layer.isRootElement) {
    styles.border = '#ccc solid 1px'
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
      onDragEnd: id => {},
    },
    resizable: {
      onResizeEnd: (id, { width, height }, { x, y }) => {
        updateComponent({
          variables: {
            componentId: id,
            componentInput: {
              x,
              y,
              props: {
                ...props,
                style: { width, height },
              },
            },
          },
        })
      },
    },
  })
  const { x, y, props } = layer

  const styles: React.CSSProperties = {
    width: props.style?.width || 50,
    height: props.style?.height || 50,
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

function convertDraftJSBindings(value: string) {
  try {
    const jsonValue = JSON.parse(value)
    if (jsonValue.blocks) {
      return jsonValue.blocks.map((block: any) => block.text).join('\n')
    }
  } catch {}
  return value
}

function getComponentSchema(
  packageData: GetPackagesQuery,
  layer: Component
): Schema {
  const componentPackage = packageData.getPackages.find(
    p => p.packageName === layer.package
  )
  if (componentPackage) {
    const component = componentPackage.components.find(
      component => component.name === layer.type
    )
    if (component) {
      return component.schema
    }
  }
  throw new Error('Schema not found')
}

const LayerSub: React.FC<LayerProps> = function LayerSub({
  layer,
  selection,
  onSelect,
}) {
  const { data: packageData } = useGetPackagesQuery()
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
  const props = { ...layer.props }
  Object.keys(props).forEach(
    key => (props[key] = convertDraftJSBindings(props[key]))
  )
  if (!packageData?.getPackages) {
    return <div>loading...</div>
  }
  const schema = getComponentSchema(packageData, layer)
  return (
    <>
      {selected && (
        <Portal id="property-window">
          <PropertyWindow
            elementId={layer._id}
            schema={JSON.parse(JSON.stringify(schema))}
            properties={JSON.parse(JSON.stringify(props))}
          />
        </Portal>
      )}
      <WrapperType layer={layer} selected={selected} onClick={onSelect}>
        {layer.isContainer ? (
          <InlineComponent
            id={`component=${layer._id}`}
            {...props}
            style={{
              ...props.style,
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          >
            {layer.children?.map(child => (
              <LayerSub
                layer={child}
                selection={selection}
                onSelect={onSelect}
              />
            ))}
          </InlineComponent>
        ) : (
          <div>
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
            >
              <InlineComponent
                id={`component=${layer._id}`}
                {...props}
                style={{
                  ...props.style,
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        )}
      </WrapperType>
    </>
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
