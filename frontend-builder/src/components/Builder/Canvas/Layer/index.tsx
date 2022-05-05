import React, { PropsWithChildren, useRef } from 'react'
import styled from '@emotion/styled'

import { useSelection, useDragDrop } from '../../../../utils/hooks'
import {
  PackageComponentType,
  useUpdateComponentMutation,
} from '../../../../generated/graphql'
import { useGetPackagesQuery } from '../../../../generated/graphql'
import { StructuredComponent } from '../../../../utils/hooks/useProjectComponents'
import { useParams } from 'react-router-dom'
import { DraftJSEditorConverter } from '../../../../utils/draftJsConverters'
import { getComponentSchema } from '../../../../utils/getComponentSchema'

type ClickHandler = React.MouseEventHandler<HTMLDivElement>

interface InlineProps {
  layer: StructuredComponent
  selected: boolean
  onClick?: ClickHandler
}

interface FrameProps extends InlineProps {
  layer: StructuredComponent
}

const BOX_SHADOW = '0 0 0 2px var(--primary)'

const FrameWrapper = styled.div<{ name?: string; root?: boolean }>`
  position: ${p => (p.root ? 'absolute' : 'initial')};
  &:before {
    content: '${p => p.name}';
    position: absolute;
    top: -20px;
    color: var(--attention);
  }
  pointer-events: all;
`

const StackLayer: React.FC<FrameProps> = function AbsoluteLayer({
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
    width: props?.style?.width || 50,
    height: 'auto',
    minHeight: '100px',
    pointerEvents: 'all',
    left: x || 0,
    top: y || 0,
    zIndex: 10,
    border: '#ccc dashed 1px',
  }

  if (selected) {
    styles.border = 'var(--primary) dashed 1px'
  }
  const classNames = ['droppable', 'root-element']
  return (
    <FrameWrapper
      name={layer.name}
      root={!!layer.parent?._id}
      id={layer._id}
      className={classNames.join(' ')}
      style={styles}
      ref={ref}
      onClick={onClick}
      data-package={layer.package}
      data-type={layer.type}
      data-parentid={layer.parent?._id}
    >
      {children}
    </FrameWrapper>
  )
}

function ScreenLayer({
  layer,
  children,
  onClick,
}: PropsWithChildren<FrameProps>) {
  const classNames = ['droppable', 'root-element']
  const { x, y, props } = layer

  const styles: React.CSSProperties = {
    width: props?.style?.width || 50,
    height: props?.style?.height || 50,
    pointerEvents: 'all',
    left: x || 0,
    top: y || 0,
    zIndex: 10,
    border: '#ccc solid 1px',
  }

  return (
    <FrameWrapper
      name={layer.name}
      id={layer._id}
      root={!!layer.parent?._id}
      style={styles}
      className={classNames.join(' ')}
      onClick={onClick}
      data-package={layer.package}
      data-type={layer.type}
      data-parentid={layer.parent?._id}
    >
      <div style={{ contain: 'content' }}>{children}</div>
    </FrameWrapper>
  )
}

const AbsolutePositionedRootElement = styled.div`
  position: absolute;
  & > div:hover: {
    display: none;
  }
  pointer-events: all;
`

const Layer = React.memo(function Layer({
  layer,
}: {
  layer: StructuredComponent
}) {
  const { data: packageData } = useGetPackagesQuery()
  const { selection, setSelection } = useSelection()
  const { projectId } = useParams<{ projectId: string }>()
  const selected = !!selection?.includes(layer._id)
  const ref = useRef<HTMLDivElement>()

  // @ts-ignore
  if (!window[layer.package]) {
    return <div>Missing Package</div>
  }
  if (!packageData) {
    return null
  }
  if (ref.current) {
    if (selected) {
      ref.current.style.boxShadow = BOX_SHADOW
    } else {
      ref.current.style.boxShadow = ''
    }
  }
  let WrapperType: React.FC<any>
  switch (layer.componentType) {
    case PackageComponentType.Stack:
      WrapperType = StackLayer
      break
    case PackageComponentType.Screen:
      WrapperType = ScreenLayer
      break
    case PackageComponentType.Container:
    case PackageComponentType.Element:
      WrapperType = ({ children }: PropsWithChildren<{}>) => <>{children}</>
      break
  }
  const schema = getComponentSchema(packageData, layer)
  // @ts-ignore
  const LayerComponent = window[layer.package][layer.type]
  const convertedProps = DraftJSEditorConverter({ ...layer.props }, projectId)
  const editor = {
    inEditMode: true,
    onSelect: (e: string) => {
      setSelection([e])
    },
    ref,
    id: `${layer._id}`,
  }
  return (
    <>
      <WrapperType layer={layer}>
        {layer.componentType === PackageComponentType.Element ? (
          <LayerComponent editor={editor} {...convertedProps} />
        ) : schema.type === 'array' ? (
          [1, 2, 3].map((item, index) => (
            <LayerComponent key={index} {...convertedProps} editor={editor}>
              {layer.children?.map(child => (
                <Layer layer={child} key={child._id} />
              ))}
            </LayerComponent>
          ))
        ) : (
          <LayerComponent {...convertedProps} editor={editor}>
            {layer.children?.map(child => (
              <Layer layer={child} key={child._id} />
            ))}
          </LayerComponent>
        )}
      </WrapperType>
    </>
  )
})

export function RootElement({ layer }: { layer: StructuredComponent }) {
  return (
    <AbsolutePositionedRootElement
      style={{ top: `${layer.y}px`, left: `${layer.x}px` }}
    >
      <Layer layer={layer} />
    </AbsolutePositionedRootElement>
  )
}

export default RootElement
