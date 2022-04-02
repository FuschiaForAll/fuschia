import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import { Paper } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Component,
  GetPreviewerDataDocument,
  useGetComponentsQuery,
  useGetPreviewerDataQuery,
  useGetProjectQuery,
  useUpdatePreviewerDataMutation,
} from '../../generated/graphql'
import styled from '@emotion/styled'
import { ActionProps } from '../Builder/Properties/Editors/FunctionEditor'
import { executeAction } from './executeAction'
import { convertToObject } from 'typescript'

const FrameWrapper = styled.div`
  pointer-events: all;
  width: 375px;
  height: 650px;
  border: solid 1px black;
  overflow: auto;
  align-self: center;
  justify-self: center;
`

function convertDraftJSBindings(value: any, inputState: any, entityState: any) {
  try {
    if (value.blocks) {
      let textParts = [] as string[]
      // update block text, replacing entity ranges
      value.blocks.forEach((block: any) => {
        let currentText = block.text
        ;[...block.entityRanges].reverse().forEach((range: any) => {
          // find out what we are replacing the text with
          let replacementText = ''
          if (value.entityMap && value.entityMap[range.key]) {
            switch (value.entityMap[range.key].data?.type) {
              case 'INPUT':
                replacementText =
                  inputState[
                    value.entityMap[range.key].data?.entityPath
                      ?.split('.')
                      .pop()
                  ]
            }
          }
          currentText = `${currentText.slice(
            0,
            range.offset
          )}${replacementText}${currentText.slice(range.offset + range.length)}`
        })
        textParts.push(currentText)
      })
      return textParts.join('\n')
    }
  } catch (e) {
    console.error(e)
  }
  return value
}

function Viewer(props: {
  project: Project
  layer?: Component
  navigate: (screenId: string) => void
  onInputChange: (key: string, value: any) => void
  onEntityChange: (value: any) => void
  inputState: any
  entityState: any
}) {
  if (!props.layer) {
    return <div>No entry point created</div>
  }
  // convert bindings
  const componentProperties = { ...props.layer.props }
  Object.keys(componentProperties).forEach(
    key =>
      (componentProperties[key] = convertDraftJSBindings(
        componentProperties[key],
        props.inputState,
        props.entityState
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
            <Viewer
              project={props.project}
              layer={child}
              navigate={props.navigate}
              inputState={props.inputState}
              onInputChange={props.onInputChange}
              entityState={props.entityState}
              onEntityChange={props.onEntityChange}
            />
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
            <Viewer
              project={props.project}
              layer={child}
              navigate={props.navigate}
              inputState={props.inputState}
              onInputChange={props.onInputChange}
              entityState={props.entityState}
              onEntityChange={props.onEntityChange}
            />
          ))}
        </InlineComponent>
      </div>
    )
  } else {
    if (props.layer.data) {
      Object.keys(props.layer.data).forEach(key => {
        componentProperties[key] = {
          // @ts-ignore
          value: props.inputState[`${props.layer?._id}+${key}`] || '',
          onChange: (e: any) => {
            props.onInputChange(`${props.layer?._id}+${key}`, e)
          },
        }
      })
    }
    if (componentProperties.onPress) {
      componentProperties.onPressActions = componentProperties.onPress
      componentProperties.onPress = () => {
        componentProperties.onPressActions.forEach((action: ActionProps) => {
          executeAction(
            action,
            props.navigate,
            convertDraftJSBindings,
            props.inputState,
            props.entityState,
            props.project,
            props.onEntityChange
          )
        })
      }
    }
    return (
      <div style={styles}>
        <InlineComponent {...componentProperties} />
      </div>
    )
  }
}

const Previewer: React.FC = function Previewer() {
  const navigate = useNavigate()
  const [inputState, setInputState] = useState({})
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
  const { data: PreviewerData } = useGetPreviewerDataQuery({
    variables: {
      projectId,
    },
  })
  const [updatePreviewerData] = useUpdatePreviewerDataMutation({
    refetchQueries: [
      { query: GetPreviewerDataDocument, variables: { projectId } },
    ],
  })
  // useEffect(() => {
  //   localStorage.setItem('previewerState', JSON.stringify(inputState))
  // }, [inputState])
  useEffect(() => {
    // const state = localStorage.getItem('previewerState')
    // if (state) {
    //load the last state
    // setInputState(JSON.parse(state))
    // } else {
    // create the state
    // }
  }, [])

  useEffect(() => {
    if (projectData) {
      setScreen(projectData.getProject.appConfig.appEntryComponentId)
    }
  }, [projectData])
  if (!projectData || !componentsData || !PreviewerData) {
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
        <span>
          Previewer
          <button
            onClick={() =>
              updatePreviewerData({
                variables: {
                  projectId,
                  data: null,
                },
              })
            }
          >
            Reset previewer data
          </button>
        </span>
        <FrameWrapper>
          <Viewer
            project={projectData.getProject}
            // @ts-ignore
            layer={entryPoint}
            navigate={componentId => setScreen(componentId)}
            onInputChange={(key, value) => {
              if (key) {
                setInputState(s => ({
                  ...s,
                  [key]: value,
                }))
              }
            }}
            inputState={inputState}
            entityState={JSON.parse(
              JSON.stringify(PreviewerData?.getPreviewerData.data)
            )}
            onEntityChange={newState => {
              updatePreviewerData({
                variables: {
                  projectId,
                  data: newState,
                },
              })
            }}
          />
        </FrameWrapper>
      </Paper>
    </Modal>
  )
}

export default Previewer

interface Project {
  __typename?: 'Project'
  _id: any
  appId: string
  projectName: string
  appConfig: {
    __typename?: 'AppConfig'
    appEntryComponentId?: any | null
    apiConfig: {
      __typename?: 'Api'
      sandboxEndpoint?: string | null
      liveEndpoint?: string | null
      queries: Array<string>
      mutations: Array<string>
      subscriptions: Array<string>
      models: Array<{
        __typename?: 'EntityModel'
        _id: any
        name: string
        keys: Array<{
          __typename?: 'Key'
          name: string
          fieldNames: Array<string>
        }>
        auth: Array<{
          __typename?: 'DataAuth'
          allow: string
          provider: string
          ownerField: string
          identityClaim: string
          groupClaim: string
          groups: Array<string>
          groupsField: string
          operations: Array<string>
        }>
        fields: Array<{
          __typename?: 'DataField'
          _id: any
          fieldName: string
          isUnique: boolean
          isHashed: boolean
          isList?: boolean | null
          nullable: boolean
          dataType: string
          connection?: boolean | null
          rules: Array<{
            __typename?: 'DataAuth'
            allow: string
            provider: string
            ownerField: string
            identityClaim: string
            groupClaim: string
            groups: Array<string>
            groupsField: string
            operations: Array<string>
          }>
          keys: Array<{
            __typename?: 'Key'
            name: string
            fieldNames: Array<string>
          }>
        }>
      }>
    }
    authConfig: {
      __typename?: 'Auth'
      requiresAuth: boolean
      allowUnauthenticatedUsers: boolean
      mfaEnabled: boolean
      mfaConfiguration: string
      mfaTypes: string
      smsAuthenticationMessage: string
      smsVerificationMessage: string
      emailVerificationSubject: string
      emailVerificationMessage: string
      defaultPasswordPolicy: boolean
      passwordPolicyMinLength: number
      passwordRequiresUppercase: boolean
      passwordRequiresNumbers: boolean
      passwordRequiresSymbols: boolean
      requiredAttributes: Array<string>
      clientRefreshTokenValidity: number
      usernameCaseSensitive: boolean
      tableId: string
      usernameFieldId: string
      passwordFieldId: string
    }
  }
}
