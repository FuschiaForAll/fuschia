import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import { Paper } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
  GetPackagesQuery,
  GetPreviewerDataDocument,
  PackageComponentType,
  useGetPackagesQuery,
  useGetPreviewerDataQuery,
  useGetProjectQuery,
  useUpdatePreviewerDataMutation,
} from '../../generated/graphql'
import styled from '@emotion/styled'
import { ActionProps } from '../Builder/Properties/Editors/FunctionEditor'
import { executeAction } from './executeAction'
import { Schema } from '../../../../types/src/properties'
import {
  StructuredComponent,
  useProjectComponents,
} from '../../utils/hooks/useProjectComponents'

const FrameWrapper = styled.div`
  pointer-events: all;
  width: 375px;
  height: 650px;
  border: solid 1px black;
  overflow: auto;
  align-self: center;
  justify-self: center;
`

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

function convertDraftJSBindings(
  value: any,
  inputState: any,
  entityState: any,
  localState: any,
  dataContext: any
) {
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
                break
              case 'LOCAL_DATA':
                {
                  const path = value.entityMap[range.key].data?.entityPath
                    ?.split('.')
                    .pop()
                  if (path) {
                    replacementText = localState[path]
                  }
                }
                break
              case 'SERVER_DATA':
                {
                  const path = value.entityMap[range.key].data?.entityPath
                    ?.split('.')
                    .pop()
                  if (path) {
                    if (dataContext[path]) {
                      replacementText = dataContext[path]
                    }
                  }
                }
                break
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
    console.error(`BINDING ERROR`)
    console.error(e)
  }
  // it might be a property primitive
  if (value.split && dataContext && dataContext[value.split('.').pop()]) {
    return dataContext[value.split('.').pop()]
  }
  return value
}

function Viewer(props: {
  packageData: GetPackagesQuery
  project: Project
  layer?: StructuredComponent
  navigate: (screenId: string, dataParams?: any) => void
  onInputChange: (key: string, value: any) => void
  onEntityChange: (value: any) => void
  onLocalStateChange: (value: any) => void
  inputState: any
  entityState: any
  localState: any
  dataContext: any
}): JSX.Element | null {
  function buildDataContext(component: StructuredComponent) {
    if (component.fetched) {
    }
    return props.dataContext
  }
  if (!props.layer) {
    return <div>No entry point created</div>
  }
  const schema = getComponentSchema(props.packageData, props.layer)
  // convert bindings
  const componentProperties = { ...props.layer.props }
  Object.keys(componentProperties).forEach(
    key =>
      (componentProperties[key] = convertDraftJSBindings(
        componentProperties[key],
        props.inputState,
        props.entityState,
        props.localState,
        props.dataContext
      ))
  )
  const InlineComponent =
    // @ts-ignore
    window[props.layer.package].components[props.layer.type]
  if (props.layer.type === 'Checkbox') {
    if (componentProperties.value) {
      componentProperties.value = componentProperties.value === 'true'
    }
  }
  const styles: React.CSSProperties = {
    width: componentProperties.style?.width || 50,
    height: componentProperties.style?.height || 50,
    pointerEvents: 'all',
    zIndex: 1000,
    position: 'absolute',
    left: `${props.layer.x}px`,
    top: `${props.layer.y}px`,
  }
  if (props.layer.componentType === PackageComponentType.Screen) {
    return (
      <div>
        <InlineComponent {...componentProperties}>
          {props.layer.children?.map(child => (
            <Viewer
              dataContext={buildDataContext(child)}
              packageData={props.packageData}
              project={props.project}
              layer={child}
              navigate={props.navigate}
              inputState={props.inputState}
              localState={props.localState}
              onLocalStateChange={props.onLocalStateChange}
              onInputChange={props.onInputChange}
              entityState={props.entityState}
              onEntityChange={props.onEntityChange}
            />
          ))}
        </InlineComponent>
      </div>
    )
  }
  if (props.layer.componentType !== PackageComponentType.Element) {
    if (schema.type === 'array') {
      // get array data
      if (props.layer.fetched && props.layer.fetched.length === 1) {
        const fetched = props.layer.fetched[0]
        if (props.entityState[fetched.entityType]) {
          let compData = []
          if (fetched.variables) {
            compData = props.entityState[fetched.entityType].filter(
              (record: any) =>
                fetched?.variables?.every(
                  variable =>
                    record[variable.key] !==
                    convertDraftJSBindings(
                      variable.value,
                      props.inputState,
                      props.entityState,
                      props.localState,
                      props.dataContext
                    )
                )
            )
          } else {
            compData = props.entityState[fetched.entityType]
          }
          return (
            <div style={styles}>
              {compData.map((d: any) => (
                <InlineComponent
                  {...componentProperties}
                  style={{
                    ...componentProperties.style,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {props.layer?.children?.map(child => (
                    <Viewer
                      dataContext={{
                        ...props.dataContext,
                        ...d,
                      }}
                      packageData={props.packageData}
                      project={props.project}
                      layer={child}
                      navigate={props.navigate}
                      inputState={props.inputState}
                      onInputChange={props.onInputChange}
                      entityState={props.entityState}
                      onEntityChange={props.onEntityChange}
                      localState={props.localState}
                      onLocalStateChange={props.onLocalStateChange}
                    />
                  ))}
                </InlineComponent>
              ))}
            </div>
          )
        }
        return null
      }
    }
    return (
      <div style={styles}>
        <InlineComponent {...componentProperties}>
          {props.layer.children?.map(child => (
            <Viewer
              dataContext={props.dataContext}
              packageData={props.packageData}
              project={props.project}
              layer={child}
              navigate={props.navigate}
              inputState={props.inputState}
              onInputChange={props.onInputChange}
              entityState={props.entityState}
              onEntityChange={props.onEntityChange}
              localState={props.localState}
              onLocalStateChange={props.onLocalStateChange}
            />
          ))}
        </InlineComponent>
      </div>
    )
  } else {
    // if (props.layer.data) {
    //   Object.keys(props.layer.data).forEach(key => {
    //     componentProperties[key] = {
    //       // @ts-ignore
    //       value: props.inputState[`${props.layer?._id}+${key}`] || '',
    //       onChange: (e: any) => {
    //         props.onInputChange(`${props.layer?._id}+${key}`, e)
    //       },
    //     }
    //   })
    // }
    // TODO: this must be dynamic based on schema
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
            props.localState,
            props.project,
            props.onEntityChange,
            props.onLocalStateChange,
            props.dataContext
          )
        })
      }
    }
    if (componentProperties.onValueChange) {
      componentProperties.onValueChangeActions =
        componentProperties.onValueChange
      componentProperties.onValueChange = () => {
        componentProperties.onValueChangeActions.forEach(
          (action: ActionProps) => {
            executeAction(
              action,
              props.navigate,
              convertDraftJSBindings,
              props.inputState,
              props.entityState,
              props.localState,
              props.project,
              props.onEntityChange,
              props.onLocalStateChange,
              props.dataContext
            )
          }
        )
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
  const [localState, setLocalState] = useState({})
  const [dataContext, setDataContext] = useState({})
  const [screen, setScreen] = useState<string>()
  const { projectId } = useParams<{ projectId: string }>()
  const { data: projectData } = useGetProjectQuery({
    variables: {
      projectId,
    },
  })
  const { structuredComponents: components } = useProjectComponents()
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
  const { data: packageData } = useGetPackagesQuery()
  useEffect(() => {
    localStorage.setItem('previewerLocalState', JSON.stringify(localState))
  }, [localState])
  useEffect(() => {
    const state = localStorage.getItem('previewerLocalState')
    if (state) {
      setLocalState(JSON.parse(state))
    }
  }, [])

  useEffect(() => {
    if (projectData) {
      setScreen(projectData.getProject.appConfig.appEntryComponentId)
    }
  }, [projectData])
  if (!projectData || !components || !PreviewerData || !packageData) {
    return <div>Loading</div>
  }
  const entryPoint = components.find(c => c._id === screen)
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
            dataContext={dataContext}
            packageData={packageData}
            project={projectData.getProject}
            // @ts-ignore
            layer={entryPoint}
            navigate={(componentId, paramData) => {
              setScreen(componentId)
              setDataContext(paramData)
            }}
            onInputChange={(key, value) => {
              if (key) {
                setInputState(s => ({
                  ...s,
                  [key]: value,
                }))
              }
            }}
            inputState={inputState}
            localState={localState}
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
            onLocalStateChange={newState => setLocalState(newState)}
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
