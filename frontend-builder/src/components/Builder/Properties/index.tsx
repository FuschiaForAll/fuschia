import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { useSelection } from '../../../utils/hooks'
import Paper from '@mui/material/Paper'
import { useGetPackagesQuery } from '../../../generated/graphql-packages'

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
  width: 250px;
  max-height: 100%;
  padding-top: calc(56px + 1rem);
`

const cardStyles = {
  padding: '0.5rem 0',
  margin: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pointerEvents: 'all',
}

function Property(props: any) {
  const { prop, name } = props
  return (
    <div>
      {typeof prop === 'object' ? (
        <fieldset>
          <legend>{name}</legend>
          {Object.keys(prop).map(subProp => (
            <Property name={subProp} prop={prop[subProp]} key={subProp} />
          ))}
        </fieldset>
      ) : (
        <div>
          <span>{name}</span>
          <input
            defaultValue={prop}
            onChange={e => {
              const element = document.getElementById(props.elementId)
              if (element) {
                element.textContent = e.target.value
              }
            }}
          />
        </div>
      )}
    </div>
  )
}

function Properties(props: { properties?: string; elementId: string }) {
  const objectProps = JSON.parse(props.properties || '{}')
  return (
    <div>
      {Object.keys(objectProps).map(prop => (
        <Property
          elementId={props.elementId}
          name={prop}
          prop={objectProps[prop]}
          key={prop}
        />
      ))}
    </div>
  )
}

const PropertyWindow: React.FC = function PropertyWindow() {
  const { selection } = useSelection()
  const { data: packageData } = useGetPackagesQuery()
  const [properties, setProperties] = useState<any>()
  useEffect(() => {
    if (selection && packageData) {
      // get the DOM elemenet so we can find package and type
      const selectedNodes = selection.map(selectedItem =>
        document.getElementById(selectedItem)
      )
      if (selectedNodes.length === 1) {
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
            setProperties(selectedProps.props)
          }
        }
      }
    }
  }, [packageData, selection])
  if (selection && selection.length > 0) {
    return (
      <Wrapper>
        <Inner>
          <Paper elevation={12} sx={cardStyles}>
            <Properties elementId={selection[0]} properties={properties} />
          </Paper>
        </Inner>
      </Wrapper>
    )
  }
  return <></>
}

export default PropertyWindow
