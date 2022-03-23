import styled from '@emotion/styled'
import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import Editor from './Editors/Editor'
import {
  useGetComponentQuery,
  useGetProjectQuery,
  useUpdateComponentMutation,
} from '../../../generated/graphql'
import { Schema } from '@fuchsia/types'
import TabPanel from '../../Shared/TabPanel'
import DataSources from './DataSources'
import { useParams } from 'react-router-dom'
import { LabeledTextInput } from '../../Shared/primitives/LabeledTextInput'

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

function Properties(props: { schema: Schema; elementId: string }) {
  let { projectId } = useParams<{ projectId: string }>()
  const [value, setValue] = useState(0)
  const [updateComponent] = useUpdateComponentMutation()
  const { data: projectData } = useGetProjectQuery({
    variables: {
      projectId,
    },
  })
  const { data: componentData, loading } = useGetComponentQuery({
    variables: {
      componentId: props.elementId,
    },
  })
  function getReference(name: string) {
    if (props.schema.definitions) {
      return props.schema.definitions[name.substring('#/definitions/'.length)]
    }
    return undefined
  }
  if (!componentData?.getComponent) {
    return <div>Loading</div>
  }
  if (loading) {
    return null
  }
  return (
    <>
      <LabeledTextInput
        label="Component Name"
        value={componentData.getComponent.name}
        onChange={e => {
          const newName = e.target.value
          updateComponent({
            variables: {
              componentId: props.elementId,
              componentInput: {
                name: newName,
              },
            },
          })
        }}
      />
      <div style={{ marginTop: '10px' }}>
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
        {componentData.getComponent.isContainer && (
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
        )}
      </div>
      <TabPanel value={value} index={0}>
        <Editor
          componentId={props.elementId}
          initialValue={JSON.parse(
            JSON.stringify(componentData.getComponent.props)
          )}
          updateValue={(value, isValid) => {
            updateComponent({
              variables: {
                componentId: props.elementId,
                componentInput: {
                  props: value,
                },
              },
            })
          }}
          getReference={getReference}
          required={true}
          schema={props.schema}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DataSources
          models={projectData?.getProject.appConfig.apiConfig.models || []}
          componentId={props.elementId}
          componentQuery={componentData}
        />
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
  return (
    <Wrapper onClick={e => e.stopPropagation()}>
      <Inner>
        <Paper elevation={12} sx={cardStyles}>
          <span>{props.schema.title}</span>
          <Properties elementId={props.elementId} schema={props.schema} />
        </Paper>
      </Inner>
    </Wrapper>
  )
}

export default PropertyWindow
