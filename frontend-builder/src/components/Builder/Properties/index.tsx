import styled from '@emotion/styled'
import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import Editor from './Editors/Editor'
import {
  GetProjectDocument,
  useGetComponentQuery,
  useGetProjectQuery,
  useUpdateAppConfigMutation,
} from '../../../generated/graphql'
import { Schema } from '@fuchsia/types'
import TabPanel from '../../Shared/TabPanel'
import DataSources from './DataSources'
import { useParams } from 'react-router-dom'
import { LabeledTextInput } from '../../Shared/primitives/LabeledTextInput'
import { useSelection, useUpdateComponent } from '../../../utils/hooks'
import { LabeledCheckbox } from '../../Shared/primitives/LabeledCheckbox'
import { gql } from '@apollo/client'
import { variableNameRegex } from '../../../utils/regexp'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import {
  useProjectComponents,
  StructuredComponent,
} from '../../../utils/hooks/useProjectComponents'

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
  overflowY: 'auto',
  overflowX: 'hidden',
}

function Layers({ componentId }: { componentId: string }) {
  const { projectId } = useParams<{ projectId: string }>()
  const components = useProjectComponents(projectId!)
  const { setSelection } = useSelection()
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
      })
      return true
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
  const displayChildren = (c: StructuredComponent[]) => {
    return (
      <ul>
        {c.map(_c => (
          <li
            onClick={e => {
              e.stopPropagation()
              setSelection([_c._id])
            }}
          >
            {_c.name}
            {_c.children && displayChildren(_c.children)}
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div>
      {component && (component as StructuredComponent).children ? (
        displayChildren((component as StructuredComponent).children!)
      ) : (
        <div>No Children</div>
      )}
    </div>
  )
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
  const [name, setName] = useState(component.name)
  const { updateComponent, updateComponentProps } = useUpdateComponent()
  const { data: projectData } = useGetProjectQuery({
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
  function getReference(name: string) {
    if (schema.definitions) {
      return schema.definitions[name.substring('#/definitions/'.length)]
    }
    return undefined
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
      {component.isRootElement && (
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
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <span
          onClick={() => setValue(0)}
          style={{
            fontWeight: 600,
            color: value === 0 ? 'var(--accent)' : '#808080',
            borderWidth: '2px',
            borderStyle: 'solid',
            padding: '2px 5px',
            borderRadius: '5px',
            borderColor: value === 0 ? 'var(--accent)' : 'transparent',
            cursor: 'pointer',
          }}
        >
          Properties
        </span>
        {component.componentType === 'Screen' && (
          <>
            <span
              onClick={() => setValue(1)}
              style={{
                fontWeight: 600,
                color: value === 1 ? 'var(--accent)' : '#808080',
                borderWidth: '2px',
                borderStyle: 'solid',
                padding: '2px 5px',
                borderRadius: '5px',
                borderColor: value === 1 ? 'var(--accent)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              Data
            </span>
          </>
        )}
        {component.componentType !== 'Element' && (
          <span
            onClick={() => setValue(2)}
            style={{
              fontWeight: 600,
              color: value === 2 ? 'var(--accent)' : '#808080',
              borderWidth: '2px',
              borderStyle: 'solid',
              padding: '2px 5px',
              borderRadius: '5px',
              borderColor: value === 2 ? 'var(--accent)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            Layers
          </span>
        )}
      </div>
      <TabPanel value={value} index={0}>
        <Editor
          componentId={elementId}
          initialValue={JSON.parse(JSON.stringify(component.props))}
          updateValue={(value, isValid) => {
            if (value) {
              updateComponentProps(elementId, value, component.props)
            }
          }}
          getReference={getReference}
          required={true}
          schema={schema}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DataSources
          models={projectData?.getProject.appConfig.apiConfig.models || []}
          componentId={elementId}
          component={component}
        />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Layers componentId={elementId} />
      </TabPanel>
    </>
  )
}

interface PropertyWindowProps {
  schema: Schema
  properties: any
  elementId: string
}

const PropertyWindow: React.FC<PropertyWindowProps> = function PropertyWindow(
  props
) {
  const { data: componentData } = useGetComponentQuery({
    variables: {
      componentId: props.elementId,
    },
  })
  function handleDragEnd(e: DropResult) {}

  if (componentData && componentData.getComponent) {
    return (
      <Wrapper
        onClick={e => e.stopPropagation()}
        onWheel={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Inner>
            <Paper elevation={12} sx={cardStyles}>
              <span>{props.schema.title}</span>
              <Properties
                component={componentData.getComponent}
                elementId={props.elementId}
                schema={props.schema}
              />
            </Paper>
          </Inner>
        </DragDropContext>
      </Wrapper>
    )
  }
  return null
}

export default PropertyWindow
