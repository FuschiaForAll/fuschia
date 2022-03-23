import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import { Paper } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Component,
  useGetComponentsQuery,
  useGetProjectQuery,
} from '../../generated/graphql'
import styled from '@emotion/styled'
import { ActionProps } from '../Builder/Properties/Editors/FunctionEditor'

const FrameWrapper = styled.div`
  pointer-events: all;
  width: 375px;
  height: 650px;
  border: solid 1px black;
  overflow: auto;
  align-self: center;
  justify-self: center;
`

function convertDraftJSBindings(value: string) {
  try {
    const jsonValue = JSON.parse(value)
    if (jsonValue.blocks) {
      return jsonValue.blocks.map((block: any) => block.text).join('\n')
    }
  } catch {}
  return value
}

function Viewer(props: {
  layer?: Component
  navigate: (screenId: string) => void
}) {
  const [dataState, setDataState] = useState({})
  if (!props.layer) {
    return <div>No entry point created</div>
  }
  // convert bindings
  const componentProperties = { ...props.layer.props }
  Object.keys(componentProperties).forEach(
    key =>
      (componentProperties[key] = convertDraftJSBindings(
        componentProperties[key]
      ))
  )
  const InlineComponent =
    // @ts-ignore
    window[props.layer.package].components[props.layer.type]
  const styles: React.CSSProperties = {
    width: componentProperties.style?.width || 50,
    height: componentProperties.style?.height || 50,
    pointerEvents: 'all',
    zIndex: 1000,
    position: 'absolute',
    left: `${props.layer.x}px`,
    top: `${props.layer.y}px`,
  }
  if (props.layer.isRootElement) {
    return (
      <div>
        <InlineComponent {...componentProperties}>
          {props.layer.children?.map(child => (
            <Viewer layer={child} navigate={props.navigate} />
          ))}
        </InlineComponent>
      </div>
    )
  }
  if (props.layer.isContainer) {
    return (
      <div style={styles}>
        <InlineComponent {...componentProperties}>
          {props.layer.children?.map(child => (
            <Viewer layer={child} navigate={props.navigate} />
          ))}
        </InlineComponent>
      </div>
    )
  } else {
    if (props.layer.data) {
      Object.keys(props.layer.data).forEach(key => {
        componentProperties[key] = {
          // @ts-ignore
          value: dataState[key],
          onChange: (e: any) => {
            debugger
            setDataState(ds => ({
              ...ds,
              [key]: e,
            }))
          },
        }
      })
    }
    if (componentProperties.onPress) {
      componentProperties.onPressActions = componentProperties.onPress
      componentProperties.onPress = () => {
        debugger
        const currentActions = JSON.parse(
          componentProperties.onPressActions
        ) as ActionProps[]
        currentActions.forEach(action => {
          switch (action.type) {
            case 'NAVIGATE':
              props.navigate(action.destination)
          }
        })
      }
    }
    console.log(dataState)
    return (
      <div style={styles}>
        <InlineComponent {...componentProperties} />
      </div>
    )
  }
}

const Previewer: React.FC = function Previewer() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState<string>()
  const { projectId } = useParams<{ projectId: string }>()
  const { data: projectData } = useGetProjectQuery({
    variables: {
      projectId,
    },
  })
  const { data: componentsData } = useGetComponentsQuery({
    variables: {
      projectId,
    },
  })
  useEffect(() => {
    if (projectData) {
      setScreen(projectData.getProject.appConfig.appEntryComponentId)
    }
  }, [projectData])
  if (!projectData && !componentsData) {
    return <div>Loading</div>
  }
  const entryPoint = componentsData?.getComponents.find(c => c._id === screen)
  return (
    <Modal open={true} onClose={() => navigate('../')} sx={{ padding: '5rem' }}>
      <Paper
        sx={{
          height: '100%',
          width: '100%',
          padding: '1rem',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        Previewer
        <FrameWrapper>
          <Viewer
            // @ts-ignore
            layer={entryPoint}
            navigate={componentId => setScreen(componentId)}
          />
        </FrameWrapper>
      </Paper>
    </Modal>
  )
}

export default Previewer
