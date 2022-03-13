import styled from '@emotion/styled'
import React from 'react'
import Paper from '@mui/material/Paper'
import Editor from './Editors/Editor'
import {
  useGetComponentQuery,
  useUpdateComponentMutation,
} from '../../../generated/graphql'
import { Schema } from '@fuchsia/types'

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
  const [updateComponent] = useUpdateComponentMutation()
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
    <Editor
      initialValue={JSON.parse(componentData.getComponent.props || '{}')}
      updateValue={(value, isValid) => {
        updateComponent({
          variables: {
            componentId: props.elementId,
            componentInput: {
              props: JSON.stringify(value),
            },
          },
        })
      }}
      getReference={getReference}
      required={true}
      schema={props.schema}
    />
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
