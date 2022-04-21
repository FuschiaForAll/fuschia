import React, { PropsWithChildren, useCallback, useRef } from 'react'
import styled from '@emotion/styled'

import { useSelection, Selection, useDragDrop } from '../../../../utils/hooks'
import { arrayXor } from '../../../../utils/arrays'
import {
  PackageComponentType,
  useUpdateComponentMutation,
} from '../../../../generated/graphql'
import PropertyWindow from '../../Properties'
import {
  GetPackagesQuery,
  useGetPackagesQuery,
} from '../../../../generated/graphql'
import { ArraySchema, ObjectSchema, Schema } from '@fuchsia/types'
import Portal from '../../../Shared/Portal'
import { StructuredComponent } from '../../../../utils/hooks/useProjectComponents'
import { useParams } from 'react-router-dom'

type ClickHandler = React.MouseEventHandler<HTMLDivElement>

interface LayerProps {
  layer: StructuredComponent
  selection?: Selection
  onSelect?: ClickHandler
}

interface InlineProps {
  layer: StructuredComponent
  selected: boolean
  onClick?: ClickHandler
}

interface FrameProps extends InlineProps {
  layer: StructuredComponent
}

const BOX_SHADOW = '0 0 0 2px var(--primary)'

const FrameWrapper = styled.div<{ name?: string }>`
  position: absolute;
  &:before {
    content: '${p => p.name}';
    position: absolute;
    top: -20px;
    color: var(--attention);
  }
  pointer-events: all;
`

const ContainerLayer: React.FC<FrameProps> = ({
  layer,
  children,
  selected,
  onClick,
}) => {
  const { props } = layer
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
  const styles: React.CSSProperties = {}
  if (selected) {
    styles.boxShadow = BOX_SHADOW
  }
  return (
    <div onClick={onClick} id={layer._id} ref={ref} style={styles}>
      {children}
    </div>
  )
}

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
    height: props?.style?.height || 50,
    pointerEvents: 'all',
    left: x || 0,
    top: y || 0,
    zIndex: 10,
    border: '#ccc dashed 1px',
  }

  if (selected) {
    styles.boxShadow = BOX_SHADOW
  }
  const classNames = ['droppable', 'root-element']
  return (
    <FrameWrapper
      name={layer.name}
      id={layer._id}
      className={classNames.join(' ')}
      style={styles}
      ref={ref}
      onClick={onClick}
      data-package={layer.package}
      data-type={layer.type}
      data-parentid={layer.parentId}
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
      style={styles}
      className={classNames.join(' ')}
      onClick={onClick}
      data-package={layer.package}
      data-type={layer.type}
      data-parentid={layer.parentId}
    >
      <div style={{ contain: 'content' }}>{children}</div>
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
    width: props?.style?.width || 50,
    height: props?.style?.height || 50,
    pointerEvents: 'all',
    zIndex: 1000,
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

function convertDraftJSBindings(value: any, projectId?: string) {
  if (!value) {
    return ``
  }
  if (typeof value === 'object') {
    if (value.blocks) {
      // draftjs
      if (value.entityMap) {
        for (const key in value.entityMap) {
          if (value.entityMap[key].data) {
            if (value.entityMap[key].data[0]) {
              if (value.entityMap[key].data[0].type === 'ASSET') {
                const arr = [...value.entityMap[key].data]
                arr.shift()
                return `https://localhost:4003/project-files/${projectId}/${arr
                  .map(a => a.value)
                  .join('/')}`
              }
            }
          }
        }
      }
      return value.blocks.map((block: any) => block.text).join('\n')
    }
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = convertDraftJSBindings(value[key], projectId)
      return acc
    }, {} as any)
  } else {
    return value
  }
}

function getComponentSchema(
  packageData: GetPackagesQuery,
  layer: StructuredComponent
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
  const { projectId } = useParams<{ projectId: string }>()
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
  const InlineComponent = window[layer.package][layer.type]
  let WrapperType: React.FC<any>
  switch (layer.componentType) {
    case PackageComponentType.Stack:
      WrapperType = StackLayer
      break
    case PackageComponentType.Screen:
      WrapperType = ScreenLayer
      break
    case PackageComponentType.Container:
      WrapperType = ContainerLayer
      break
    case PackageComponentType.Element:
      WrapperType = InlineLayer
      break
  }

  if (!packageData?.getPackages) {
    return <div>loading...</div>
  }
  const schema = getComponentSchema(packageData, layer) as
    | ObjectSchema
    | ArraySchema

  const convertedProps = convertDraftJSBindings({ ...layer.props }, projectId)
  // find all data items
  const findDataBound = (schema: Schema, properties: any, keys: string[]) => {
    switch (schema.type) {
      case 'object':
        if (!properties) {
          return
        }
        Object.keys(schema.properties).forEach(key => {
          findDataBound(schema.properties[key], properties[key], [...keys, key])
        })
        break
      case 'string':
      case 'number':
      case 'boolean':
        if (schema.dataBound) {
          // update the property
          let root = convertedProps
          keys.forEach(key => {
            if (!convertedProps[key]) {
              convertedProps[key] = {}
            }
            root = convertedProps[key]
          })
          root.value = 'here'
        }
        break
    }
  }
  Object.keys(schema.properties).forEach(key =>
    findDataBound(schema.properties[key], convertedProps[key], [key])
  )
  // if (layer.data) {
  //   Object.keys(layer.data).forEach(key => {
  //     convertedProps[key] = {
  //       onChange: (e: any) => {},
  //     }
  //   })
  // }

  return (
    <>
      <WrapperType layer={layer} selected={selected} onClick={onSelect}>
        {layer.componentType !== PackageComponentType.Element ? (
          schema.type === 'array' ? (
            [0, 1, 2].map(item => (
              <InlineComponent
                id={`component=${layer._id}-${item}`}
                {...convertedProps}
                style={{
                  ...convertedProps.style,
                  width: '100%',
                  height: '100%',
                  opacity: item ? 0.2 : 1,
                }}
              >
                {layer.children
                  ?.sort((a, b) => a.layerSort.localeCompare(b.layerSort))
                  .map(child => (
                    <LayerSub
                      layer={child}
                      selection={selection}
                      onSelect={onSelect}
                    />
                  ))}
              </InlineComponent>
            ))
          ) : (
            <InlineComponent
              id={`component=${layer._id}`}
              {...convertedProps}
              style={{
                ...convertedProps.style,
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
          )
        ) : (
          <div>
            <div
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <InlineComponent
                id={`component=${layer._id}`}
                {...convertedProps}
                style={{
                  ...convertedProps.style,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
            <div
              style={{
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
  const schema = getComponentSchema(packageData, layer) as
    | ObjectSchema
    | ArraySchema

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
  // @ts-ignore
  const LayerComponent = window[layer.package][layer.type]
  const convertedProps = convertDraftJSBindings({ ...layer.props }, projectId)
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
        ) : (
          <LayerComponent {...convertedProps} editor={editor}>
            {layer.children?.map(child => (
              <Layer layer={child} />
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
