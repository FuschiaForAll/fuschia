import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Editor from './Editors/Editor'
import {
  GetPackagesQuery,
  GetProjectDocument,
  PackageComponentType,
  useGetComponentQuery,
  useGetComponentsQuery,
  useGetPackagesQuery,
  useGetProjectQuery,
  useUpdateAppConfigMutation,
} from '../../../generated/graphql'
import { ArraySchema, ObjectSchema, Schema } from '@fuchsia/types'
import TabPanel from '../../Shared/TabPanel'
import DataSources from './DataSources'
import { useParams } from 'react-router-dom'
import { LabeledTextInput } from '../../Shared/primitives/LabeledTextInput'
import {
  useDeleteComponents,
  useInsertComponent,
  useSelection,
  useUpdateComponent,
} from '../../../utils/hooks'
import { LabeledCheckbox } from '../../Shared/primitives/LabeledCheckbox'
import { gql } from '@apollo/client'
import { variableNameRegex } from '../../../utils/regexp'
import {
  useProjectComponents,
  StructuredComponent,
} from '../../../utils/hooks/useProjectComponents'
import {
  DataStructure,
  MenuStructure,
  NavMenu,
} from '../../Shared/CascadingMenu'
import { FunctionWrapper, ActionWrapper } from './Editors/FunctionEditor'
import { OutlinedButton } from '../../Shared/primitives/Button'
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
  DraggableProvided,
} from 'react-beautiful-dnd'
import { DragIndicator } from '@mui/icons-material'
import { LexoRankHelper } from '../../../utils/lexoRankHelper'
import { EntitySelector } from '../../Shared/EntitySelector'
import { SourceType } from '../../../utils/draftJsConverters'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const TabHeader = styled.span`
  font-weight: 600;
  border-width: 2px;
  border-style: solid;
  padding: 2px 5px;
  border-radius: 5px;
  cursor: pointer;
`

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 2rem;
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
  overflowY: 'auto',
  overflowX: 'hidden',
}

const HeaderTypes = [
  {
    label: 'Properties',
    value: 'properties',
  },
  {
    label: 'Layout',
    value: 'layout',
  },
  {
    label: 'Styles',
    value: 'style',
  },
  {
    label: 'Actions',
    value: 'actions',
  },
]

function AddMenu({ parentId }: { parentId: string }) {
  const { data: packageData } = useGetPackagesQuery()
  const createComponent = useInsertComponent()

  return (
    <NavMenu>
      {packageData &&
        packageData.getPackages.flatMap(_package => {
          return _package.components.map(component => (
            <li
              onClick={() => {
                createComponent({
                  name: component.name,
                  componentType: component.componentType,
                  package: _package.packageName,
                  type: component.name,
                  parent: parentId,
                  props: component.defaultPropValue,
                  layout: component.defaultLayoutValue,
                  layerSort: LexoRankHelper.generateNewLexoRanking(),
                  x: 0,
                  y: 0,
                })
              }}
            >
              {component.name}
            </li>
          ))
        })}
    </NavMenu>
  )
}

function LayerChildren({
  parentId,
  childComponents,
}: {
  parentId: string
  childComponents: StructuredComponent[]
}) {
  const { setSelection } = useSelection()
  const [addMenuOpened, setAddMenuOpened] = useState(false)
  const deleteLayers = useDeleteComponents()

  return (
    <Droppable droppableId={parentId} type="ACTIONS" direction="vertical">
      {droppableActionsProvided => (
        <FunctionWrapper
          ref={droppableActionsProvided.innerRef}
          {...droppableActionsProvided.droppableProps}
        >
          {childComponents.map((_c, index) => (
            <Draggable draggableId={_c._id} index={index} key={_c._id}>
              {(provided: DraggableProvided) => (
                <ActionWrapper
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  onClick={e => {
                    e.stopPropagation()
                    setSelection([_c._id])
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: '0.5em',
                      alignItems: 'center',
                    }}
                  >
                    <div {...provided.dragHandleProps}>
                      <DragIndicator />
                    </div>
                    <div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto',
                          gap: '0.5em',
                          alignItems: 'center',
                        }}
                      >
                        <span>{_c.name}</span>
                        {_c.componentType !== PackageComponentType.Element ? (
                          <>
                            <OutlinedButton
                              onClick={e => {
                                e.stopPropagation()
                                setAddMenuOpened(o => !o)
                              }}
                            >
                              Add
                            </OutlinedButton>
                            <IconButton onClick={(e) => {
                              e.stopPropagation()
                              deleteLayers(_c._id)
                            }}>
                              <DeleteIcon />
                            </IconButton> </>
                        ) : (
                          <></>
                        )}
                      </div>
                      {_c.children && _c.children.length > 0 && (
                        <LayerChildren
                          parentId={_c._id}
                          childComponents={_c.children}
                        />
                      )}
                      {addMenuOpened && <AddMenu parentId={_c._id} />}
                    </div>
                  </div>
                </ActionWrapper>
              )}
            </Draggable>
          ))}
          {droppableActionsProvided.placeholder}
        </FunctionWrapper>
      )}
    </Droppable>
  )
}

function Layers({ componentId }: { componentId: string }) {
  const { structuredComponents: components } = useProjectComponents()
  const [addMenuOpened, setAddMenuOpened] = useState(false)
  // find the component in the structure
  let component: StructuredComponent | undefined = undefined
  components.some(c => {
    const search = (children: StructuredComponent[]) => {
      children.some(ch => {
        if (ch._id === componentId) {
          component = ch
          return true
        }
        if (ch.children) {
          return search(ch.children)
        }
        return false
      })
      return false
    }
    if (c._id === componentId) {
      component = c
      return true
    }
    if (c.children) {
      return search(c.children)
    }
    return false
  })
  if (component) {
    const structuredComponent = component as StructuredComponent
    return (
      <div>
        {structuredComponent.children ? (
          <LayerChildren
            parentId={structuredComponent._id}
            childComponents={structuredComponent.children!}
          />
        ) : (
          <div>No Children</div>
        )}
        <OutlinedButton onClick={() => setAddMenuOpened(o => !o)}>
          Add
        </OutlinedButton>
        {addMenuOpened && <AddMenu parentId={structuredComponent._id} />}

      </div>
    )
  }
  return null
}

function Properties({
  component,
  schema,
  elementId,
}: {
  schema: Schema
  elementId: string
  component: any
}) {
  let { projectId } = useParams<{ projectId: string }>()
  const [value, setValue] = useState(0)
  const [dataSourceModelStructure, setDataSourceModelStructure] = useState<
    MenuStructure[]
  >([])
  const [dataSourceDataStructure, setDataSourceDataStructure] = useState<{
    [key: string]: DataStructure
  }>({})
  const [name, setName] = useState(component.name)
  const { updateComponent, updateComponentProps } = useUpdateComponent()
  const { data: projectData } = useGetProjectQuery({
    variables: {
      projectId,
    },
  })
  const { data: componentData } = useGetComponentsQuery({
    variables: {
      projectId,
    },
  })
  const [updateAppConfig] = useUpdateAppConfigMutation({
    refetchQueries: [
      {
        query: gql`
          ${GetProjectDocument}
        `,
        variables: {
          projectId,
        },
      },
    ],
  })

  useEffect(() => {
    if (componentData) {
      const modelStructure = {} as { [key: string]: DataStructure }
      const structure = [] as MenuStructure[]

      const dataContextBuilder = [] as Array<{
        type: SourceType
        entity: string
        label: string
        source: string
      }>
      const buildRecusiveParentData = (c: any) => {
        const parent = componentData.getComponents.find(p => p._id === c.parent)
        if (parent) {
          if (parent.fetched) {
            dataContextBuilder.push({
              entity: `DC+${parent._id}`,
              label: parent.name,
              source: parent._id,
              type: 'DATA_CONTEXT',
            })
            modelStructure[`DC+${parent._id}`] = {
              _id: parent._id,
              name: parent.name,
              fields: parent.fetched
                .filter(fd => !!fd.entityType.entityMap)
                .map(fetchedData => ({
                  type: fetchedData.entityType.entityMap[0].data[0].type,
                  source: fetchedData.entityType.entityMap[0].data[0].value,
                  entity: fetchedData.entityType.entityMap[0].data[0].value,
                  label: `${parent.name}'s ${fetchedData.entityType.entityMap[0].data[0].label}`,
                  hasSubMenu: true,
                })),
            }
          }
          buildRecusiveParentData(parent)
        }
      }

      structure.push({
        type: 'DATA_CONTEXT',
        label: 'Data Context',
        hasSubMenu: true,
        entity: 'DataContext',
        source: 'DataContext',
      })
      if (component) {
        if (component.fetched) {
          dataContextBuilder.push({
            entity: `DC+${component._id}`,
            label: `My ${component.name}`,
            source: component._id,
            type: 'DATA_CONTEXT',
          })
          modelStructure[`DC+${component._id}`] = {
            _id: component._id,
            name: component.name,
            fields: component.fetched
              .filter((fd: any) => !!fd.entityType.entityMap)
              .map((fetchedData: any) => ({
                type: fetchedData.entityType.entityMap[0].data[0].type,
                source: fetchedData.entityType.entityMap[0].data[0].value,
                entity: fetchedData.entityType.entityMap[0].data[0].value,
                label: `${component.name}'s ${fetchedData.entityType.entityMap[0].data[0].label}`,
                hasSubMenu: true,
              })),
          }
        }
        buildRecusiveParentData(component)
        modelStructure.DataContext = {
          _id: 'DataContext',
          name: 'Data Context',
          fields: dataContextBuilder.map(subKey => ({
            type: subKey.type,
            entity: subKey.entity,
            hasSubMenu: true,
            source: subKey.source,
            label: subKey.label,
          })),
        }
      }
      setDataSourceModelStructure(structure)
      setDataSourceDataStructure(modelStructure || {})
    }
  }, [component, componentData])

  function getReference(name: string) {
    if (schema.definitions) {
      return schema.definitions[name.substring('#/definitions/'.length)]
    }
    return undefined
  }

  function handleLayerDragEnd(e: DropResult) {
    if (!componentData?.getComponents) {
      return
    }
    const { destination, source } = e
    if (!destination) {
      return
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    if (source.droppableId === destination.droppableId) {
      const siblings = componentData.getComponents.filter(
        c => c.parent === destination.droppableId
      )
      const sortOrder = LexoRankHelper.sortOrderAfterReorder(
        siblings,
        source.index,
        destination.index
      )
      updateComponent(
        e.draggableId,
        {
          layerSort: sortOrder,
        },
        {
          // TODO, this is not right
          layerSort: sortOrder,
        }
      )
    }
  }

  return (
    <>
      <LabeledTextInput
        label="Component Name"
        value={name}
        onBlur={e => {
          if (name !== component.name) {
            updateComponent(
              elementId,
              {
                name,
              },
              {
                name: component.name,
              }
            )
          }
        }}
        onChange={e => {
          const newName = e.target.value
          if (name === '' || variableNameRegex.test(newName)) {
            setName(newName)
          }
        }}
      />
      {(component.componentType === PackageComponentType.Screen ||
        component.componentType === PackageComponentType.Stack) && (
          <div style={{ display: 'grid', gap: '1em', gridAutoFlow: 'column' }}>
            <LabeledTextInput
              label="x"
              value={component.x}
              onChange={e => {
                const x = parseInt(e.target.value)

                updateComponent(
                  elementId,
                  {
                    x,
                  },
                  {
                    x: component.x,
                  }
                )
              }}
            />
            <LabeledTextInput
              label="y"
              value={component.y}
              onChange={e => {
                const y = parseInt(e.target.value)

                updateComponent(
                  elementId,
                  {
                    y,
                  },
                  {
                    y: component.y,
                  }
                )
              }}
            />
          </div>
        )}
      {component.componentType === PackageComponentType.Screen && (
        <LabeledCheckbox
          label="Welcome Screen?"
          checked={
            projectData?.getProject.appConfig.appEntryComponentId === elementId
          }
          onChange={e => {
            const value = e.target.checked
            if (value === true) {
              updateAppConfig({
                variables: {
                  projectId,
                  appConfig: {
                    appEntryComponentId: elementId,
                  },
                },
              })
            }
          }}
        />
      )}
      {schema.type === 'array' && (
        <div>
          <div>What is the source of the data?</div>
          <EntitySelector
            componentId={component._id}
            isList={false}
            onChange={e => {
              updateComponentProps(
                elementId,
                {
                  ...component.props,
                  dataSource: e,
                },
                component.props
              )
            }}
            entities={dataSourceModelStructure}
            dataStructure={dataSourceDataStructure}
            selectedLabel={component.props.dataSource}
          />
        </div>
      )}
      <div
        style={{
          marginTop: '10px',
          marginBottom: '10px',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {HeaderTypes.map((header, index) => {
          if ((schema as ObjectSchema).properties[header.value]) {
            return (
              <TabHeader
                key={index}
                onClick={() => setValue(index)}
                style={{
                  color: value === index ? 'var(--accent)' : '#808080',
                  borderColor:
                    value === index ? 'var(--accent)' : 'transparent',
                }}
              >
                {header.label}
              </TabHeader>
            )
          } else {
            return null
          }
        })}
        {component.componentType !== 'Element' && (
          <TabHeader
            onClick={() => setValue(4)}
            style={{
              color: value === 4 ? 'var(--accent)' : '#808080',
              borderColor: value === 4 ? 'var(--accent)' : 'transparent',
            }}
          >
            Layers
          </TabHeader>
        )}
        <TabHeader
          onClick={() => setValue(5)}
          style={{
            color: value === 5 ? 'var(--accent)' : '#808080',
            borderColor: value === 5 ? 'var(--accent)' : 'transparent',
          }}
        >
          Data
        </TabHeader>
      </div>
      {HeaderTypes.map((header, index) => {
        if ((schema as ObjectSchema).properties[header.value]) {
          return (
            <TabPanel value={value} index={index} key={index}>
              <Editor
                componentId={elementId}
                initialValue={JSON.parse(
                  JSON.stringify(component.props[header.value] || {})
                )}
                updateValue={(value, isValid) => {
                  if (value) {
                    updateComponentProps(
                      elementId,
                      {
                        ...component.props,
                        [header.value]: value,
                      },
                      component.props
                    )
                  }
                }}
                getReference={getReference}
                required={true}
                schema={(schema as ObjectSchema).properties[header.value]}
              />
            </TabPanel>
          )
        } else {
          return null
        }
      })}
      <TabPanel value={value} index={5}>
        <DataSources
          models={projectData?.getProject.serverConfig.apiConfig.models || []}
          componentId={elementId}
          component={component}
        />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <DragDropContext onDragEnd={handleLayerDragEnd}>
          <Layers componentId={elementId} />
        </DragDropContext>
      </TabPanel>
    </>
  )
}

interface PropertyWindowProps {
  elementId: string
}

function getComponentSchema(
  packageData: GetPackagesQuery,
  packageName: string,
  componentType: string
): Schema {
  const componentPackage = packageData.getPackages.find(
    p => p.packageName === packageName
  )
  if (componentPackage) {
    const component = componentPackage.components.find(
      component => component.name === componentType
    )
    if (component) {
      return component.schema
    }
  }
  throw new Error('Schema not found')
}

const PropertyWindow: React.FC<PropertyWindowProps> = function PropertyWindow(
  props
) {
  const { data: componentData } = useGetComponentQuery({
    variables: {
      componentId: props.elementId,
    },
  })
  const { data: packageData } = useGetPackagesQuery()

  if (
    componentData &&
    componentData.getComponent &&
    packageData &&
    packageData.getPackages
  ) {
    const component = componentData.getComponent
    const schema = getComponentSchema(
      packageData,
      component.package,
      component.type
    ) as ObjectSchema | ArraySchema
    return (
      <Wrapper
        onClick={e => e.stopPropagation()}
        onWheel={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      >
        <Inner>
          <Paper elevation={12} sx={cardStyles}>
            <span>{schema.title}</span>
            <Properties
              component={component}
              elementId={component._id}
              schema={schema}
            />
          </Paper>
        </Inner>
      </Wrapper>
    )
  }
  return null
}

export default PropertyWindow
