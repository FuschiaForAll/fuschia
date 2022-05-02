import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import { Paper } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
  GetPackagesQuery,
  GetPreviewerDataDocument,
  PackageComponentType,
  useGetComponentsQuery,
  useGetPackagesQuery,
  useGetPreviewerDataQuery,
  useGetProjectQuery,
  useUpdatePreviewerDataMutation,
} from '../../generated/graphql'
import styled from '@emotion/styled'
import { ActionProps } from '../Builder/Properties/Editors/FunctionEditor'
import { executeAction } from './executeAction'
import { Schema } from '../../../../types/src/properties'
import { StructuredComponent } from '../../utils/hooks/useProjectComponents'
import { DraftJSPreviewerConverter } from '../../utils/draftJsConverters'

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

function Viewer(props: {
  packageData: GetPackagesQuery
  project: Project
  layer: StructuredComponent
  navigate: (screenId: string, dataParams?: any) => void
  onInputChange: (key: string, value: any) => void
  onEntityChange: (value: any) => void
  onLocalStateChange: (value: any) => void
  inputState: any
  entityState: any
  localState: any
  dataContext: any
}): JSX.Element | null {
  function buildDataContext(component: StructuredComponent, mappedData?: any) {
    const updateContext = { ...props.dataContext }
    if (component.fetched) {
      updateContext[component._id] = {}
      component.fetched.forEach(f => {
        const entity = f.entityType as any
        if (entity && entity.blocks) {
          console.error('Filter this list based on parameters')
          updateContext[component._id][entity.entityMap[0].data[0].value] =
            props.entityState[entity.entityMap[0].data[0].value]
        }
      })
    }
    if (mappedData) {
      console.warn('this is not right')
      updateContext['mappedData'] = mappedData
    }
    return updateContext
  }
  const schema = getComponentSchema(props.packageData, props.layer)
  const { projectId } = useParams<{ projectId: string }>()
  const { data: componentsData } = useGetComponentsQuery({
    variables: {
      projectId,
    },
  })
  if (!props.layer) {
    return <div>No entry point created</div>
  }
  // convert bindings
  const componentProperties = { ...props.layer.props }
  Object.keys(componentProperties).forEach(
    key =>
      (componentProperties[key] = DraftJSPreviewerConverter(
        componentProperties[key],
        props.inputState,
        props.entityState,
        props.localState,
        props.dataContext,
        props.project._id,
        props.project.serverConfig.authConfig.tableId
      ))
  )
  if (typeof componentProperties.text === 'object') {
    debugger
  }
  const InlineComponent =
    // @ts-ignore
    window[props.layer.package][props.layer.type]
  if (props.layer.type === 'Checkbox') {
    if (componentProperties.value) {
      componentProperties.value = componentProperties.value === 'true'
    }
  }
  if (!componentsData || !componentsData.getComponents) {
    return <div>loading</div>
  }
  const children = componentsData.getComponents
    .filter(c => c.parent === props.layer._id)
    .sort((a, b) => a.layerSort.localeCompare(b.layerSort))
  if (
    schema.type === 'object' ||
    schema.type === 'layout-component' ||
    schema.type === 'ui-component'
  ) {
    // convert controlled components
    const findDataBound = (
      schema: Schema,
      currentProps: any,
      currentKey: string
    ) => {
      switch (schema.type) {
        case 'ui-component':
        case 'layout-component':
        case 'object':
          if (!schema.properties) {
            return
          }
          Object.keys(schema.properties).forEach(key => {
            if (!currentProps[key]) {
              currentProps[key] = {}
            }
            currentProps[key] = findDataBound(
              schema.properties[key],
              currentProps[key],
              key
            )
          })
          break
        case 'string':
        case 'number':
        case 'boolean':
          if (schema.dataBound) {
            // found
            return {
              //@ts-ignore
              value:
                props.inputState[`${props.layer?._id}+${currentKey}`] || '',
              onChange: (e: any) => {
                props.onInputChange(`${props.layer?._id}+${currentKey}`, e)
              },
            }
          }
      }
      return currentProps
    }
    findDataBound(schema, componentProperties, '')

    // convert actions
    if (schema.properties && schema.properties.actions) {
      if (schema.properties.actions.type === 'object') {
        Object.keys(schema.properties.actions.properties).forEach(key => {
          if (props.layer.props?.actions) {
            if (props.layer.props.actions[key]) {
              componentProperties.actions[key] = () => {
                props.layer.props?.actions[key].forEach(
                  (action: ActionProps) => {
                    executeAction(
                      action,
                      props.navigate,
                      DraftJSPreviewerConverter,
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
          }
        })
      }
    }
  }
  if (props.layer.componentType === PackageComponentType.Screen) {
    delete componentProperties.style.height
    delete componentProperties.style.width
  }
  console.log(props.layer._id)
  console.log(componentProperties)
  if (schema.type === 'array' && props.layer.props) {
    const data = findDataSourceData(
      props.layer.props.dataSource,
      props.dataContext
    )
    return (
      <>
        {data.map((d, index) => (
          <InlineComponent key={index} {...componentProperties}>
            {children?.map(child => (
              <Viewer
                dataContext={buildDataContext(child, d)}
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
        ))}
      </>
    )
  }
  return (
    <InlineComponent {...componentProperties}>
      {children?.map(child => (
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
  )

  // if (props.layer.componentType === PackageComponentType.Screen) {
  // }
  // if (props.layer.componentType !== PackageComponentType.Element) {
  //   if (schema.type === 'array') {
  //     // get array data
  //     if (props.layer.fetched && props.layer.fetched.length === 1) {
  //       const fetched = props.layer.fetched[0]
  //       if (props.entityState[fetched.entityType]) {
  //         let compData = []
  //         if (fetched.variables) {
  //           compData = props.entityState[fetched.entityType].filter(
  //             (record: any) =>
  //               fetched?.variables?.every(
  //                 variable =>
  //                   record[variable.key] !==
  //                   convertDraftJSBindings(
  //                     variable.value,
  //                     props.inputState,
  //                     props.entityState,
  //                     props.localState,
  //                     props.dataContext
  //                   )
  //               )
  //           )
  //         } else {
  //           compData = props.entityState[fetched.entityType]
  //         }
  //         return (
  //           <div style={styles}>
  //             {compData.map((d: any) => (
  //               <InlineComponent
  //                 {...componentProperties}
  //                 style={{
  //                   ...componentProperties.style,
  //                   width: '100%',
  //                   height: '100%',
  //                 }}
  //               >
  //                 {props.layer?.children?.map(child => (
  //                   <Viewer
  //                     dataContext={{
  //                       ...props.dataContext,
  //                       ...d,
  //                     }}
  //                     packageData={props.packageData}
  //                     project={props.project}
  //                     layer={child}
  //                     navigate={props.navigate}
  //                     inputState={props.inputState}
  //                     onInputChange={props.onInputChange}
  //                     entityState={props.entityState}
  //                     onEntityChange={props.onEntityChange}
  //                     localState={props.localState}
  //                     onLocalStateChange={props.onLocalStateChange}
  //                   />
  //                 ))}
  //               </InlineComponent>
  //             ))}
  //           </div>
  //         )
  //       }
  //       return null
  //     }
  //   }
  //   return (
  //     <div style={styles}>
  //       <InlineComponent {...componentProperties}>
  //         {props.layer.children?.map(child => (
  //           <Viewer
  //             dataContext={props.dataContext}
  //             packageData={props.packageData}
  //             project={props.project}
  //             layer={child}
  //             navigate={props.navigate}
  //             inputState={props.inputState}
  //             onInputChange={props.onInputChange}
  //             entityState={props.entityState}
  //             onEntityChange={props.onEntityChange}
  //             localState={props.localState}
  //             onLocalStateChange={props.onLocalStateChange}
  //           />
  //         ))}
  //       </InlineComponent>
  //     </div>
  //   )
  // } else {
  //   // if (props.layer.data) {
  //   //   Object.keys(props.layer.data).forEach(key => {
  //   //     componentProperties[key] = {
  //   //       // @ts-ignore
  //   //       value: props.inputState[`${props.layer?._id}+${key}`] || '',
  //   //       onChange: (e: any) => {
  //   //         props.onInputChange(`${props.layer?._id}+${key}`, e)
  //   //       },
  //   //     }
  //   //   })
  //   // }
  //   // TODO: this must be dynamic based on schema
  //   if (componentProperties.onPress) {
  //     componentProperties.onPressActions = componentProperties.onPress
  //     componentProperties.onPress = () => {
  //       componentProperties.onPressActions.forEach((action: ActionProps) => {
  //         executeAction(
  //           action,
  //           props.navigate,
  //           convertDraftJSBindings,
  //           props.inputState,
  //           props.entityState,
  //           props.localState,
  //           props.project,
  //           props.onEntityChange,
  //           props.onLocalStateChange,
  //           props.dataContext
  //         )
  //       })
  //     }
  //   }
  //   if (componentProperties.onValueChange) {
  //     componentProperties.onValueChangeActions =
  //       componentProperties.onValueChange
  //     componentProperties.onValueChange = () => {
  //       componentProperties.onValueChangeActions.forEach(
  //         (action: ActionProps) => {
  //           executeAction(
  //             action,
  //             props.navigate,
  //             convertDraftJSBindings,
  //             props.inputState,
  //             props.entityState,
  //             props.localState,
  //             props.project,
  //             props.onEntityChange,
  //             props.onLocalStateChange,
  //             props.dataContext
  //           )
  //         }
  //       )
  //     }
  //   }
  //   return (
  //     <div style={styles}>
  //       <InlineComponent {...componentProperties} />
  //     </div>
  //   )
  // }
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
  if (!projectData || !componentsData || !PreviewerData || !packageData) {
    return <div>Loading</div>
  }
  const entryPoint = componentsData.getComponents.find(c => c._id === screen)
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
              JSON.stringify(PreviewerData?.getPreviewerData.data || {})
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
  serverConfig: {
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
  appConfig: {
    __typename?: 'AppConfig'
    appEntryComponentId?: any | null
  }
}

function findDataSourceData(dataSource: any, dataContext: any) {
  if (dataSource.entityMap && dataSource.entityMap[0]) {
    const context = dataSource.entityMap[0].data.reduce(
      (acc: any, item: any) => {
        if (item.value === 'DataContext') {
          return acc
        }
        if (acc[item.value]) {
          return acc[item.value]
        }
        throw new Error()
      },
      dataContext
    )
    return context as []
  }
  console.error(
    `This is not right, we need to get the filtered list from context`
  )
  debugger

  return []
}
