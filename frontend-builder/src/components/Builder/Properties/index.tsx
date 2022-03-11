import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { useSelection } from '../../../utils/hooks'
import Paper from '@mui/material/Paper'
import { useGetPackagesQuery } from '../../../generated/graphql-packages'
import Editor from './Editors/Editor'
import {
  useGetComponentLazyQuery,
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

const PropertyWindow: React.FC = function PropertyWindow() {
  const { selection } = useSelection()
  const { data: packageData } = useGetPackagesQuery()
  const [schema, setSchema] = useState<Schema | undefined>()
  const [getComponent, { data: componentData }] = useGetComponentLazyQuery()
  useEffect(() => {
    if (selection && packageData) {
      // get the DOM elemenet so we can find package and type
      const selectedNodes = selection.map(selectedItem =>
        document.getElementById(selectedItem)
      )
      if (selectedNodes.length === 1) {
        // TODO: update props if the underlying package changes
        getComponent({
          variables: {
            componentId: selectedNodes[0]?.id,
          },
        })
        const selectedPackage = packageData.getPackages.find(
          packageData =>
            packageData.packageName === selectedNodes[0]?.dataset['package']
        )
        if (selectedPackage) {
          const selectedProps = selectedPackage.components.find(
            packageData =>
              packageData.name === selectedNodes[0]?.dataset['type']
          )
          if (selectedProps) {
            const schema = JSON.parse(selectedProps.schema)
            setSchema(schema as Schema)
          }
        }
      }
    }
  }, [getComponent, packageData, selection])
  if (schema && selection && componentData && componentData.getComponent) {
    return (
      <Wrapper>
        <Inner>
          <Paper elevation={12} sx={cardStyles}>
            <span>{schema.title}</span>
            <Properties elementId={selection[0]} schema={schema} />
          </Paper>
        </Inner>
      </Wrapper>
    )
  }
  return <></>
}

export default PropertyWindow
