import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  Entity,
  Modifier,
  CompositeDecorator,
  ContentState,
  ContentBlock,
} from 'draft-js'
import styled from '@emotion/styled'
import DataBinder, {
  DataStructure,
  MenuStructure,
} from '../../Builder/Properties/Editors/DataBinder'
import { useParams } from 'react-router-dom'
import {
  useGetProjectQuery,
  useListAssetFolderQuery,
  useGetComponentsQuery,
} from '../../../generated/graphql'
import { useGetPackagesQuery } from '../../../generated/graphql'
import { useProjectComponents } from '../../../utils/hooks/useProjectComponents'
import { Schema } from '@fuchsia/types'
import { SourceType } from '../../../utils/draftJsConverters'

interface FolderStructure {
  [key: string]: null | FolderStructure
}

function buildNestedStructure(keys: string[]) {
  return keys.reduce((obj, key) => {
    let branch = obj
    const parts = key.split('/')
    while (parts.length) {
      const part = parts.shift()
      if (part) {
        if (!branch[part]) {
          branch[part] = parts.length > 0 ? {} : null
        }
        if (branch[part] !== null) {
          branch = branch[part] as FolderStructure
        }
      }
    }
    return obj
  }, {} as FolderStructure)
}

const EditorWrapper = styled.div`
  margin-top: 2px;
  margin-bottom: 2px;
  display: block;
  border: none;
  border-radius: 8px;
  border: 1px solid var(--black);
  padding: 8px;
  width: 100%;
  &:focus {
    outline-color: var(--accent) !important;
    outline-width: 1px;
  }
`

function convertInitialContent(content: any) {
  if (content && content.blocks) {
    if (!content.entityMap) {
      content.entityMap = {}
    }
    return content
  }
  return {
    blocks: [
      {
        text: `${content}` || '',
        type: 'unstyled',
      },
    ],
    entityMap: {
      first: {
        type: 'PLACEHOLDER',
        mutability: 'IMMUTABLE',
        data: {
          content: 'firstName', // can be whatever
        },
      },
    },
  }
}

const Placeholder = (props: any) => {
  const data = props.contentState
    .getEntity(props.entityKey)
    .getData() as Array<{
    value: string
    label: string
    type: string
  }>
  return (
    <span
      //@ts-ignore
      readOnly={true}
      title={data.map(t => t.label).join(' > ')}
      {...props}
      style={styles.placeholder}
    >
      <span>{props.children}</span>
    </span>
  )
}

const decorator = new CompositeDecorator([
  {
    strategy: findPlaceholders,
    component: Placeholder,
  },
])

function findPlaceholders(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  contentBlock.findEntityRanges((character: any) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'PLACEHOLDER'
    )
  }, callback)
}

interface TextInputBindingProps {
  initialValue?: EditorState
  onChange: (value: any) => void
  componentId: string
}

export interface Component {
  _id: any
  package: string
  type: string
  name: string
  children?: Array<Component> | null
}

const TextInputBinding: React.FC<TextInputBindingProps> =
  function TextInputBinding({
    componentId,
    initialValue,
    onChange,
  }: TextInputBindingProps) {
    const [editorFocused, setEditorFocused] = useState(false)
    const ref = useRef<Editor>(null)
    let { projectId } = useParams<{ projectId: string }>()

    const [folderData, setFolderData] = useState<FolderStructure>({})
    const { data: FilesData } = useListAssetFolderQuery({
      variables: {
        projectId,
      },
    })
    useEffect(() => {
      if (FilesData) {
        const keyArray = FilesData.listAssetFolder.map(file => file.key)
        setFolderData(buildNestedStructure(keyArray))
      }
    }, [FilesData])
    function insertPlaceholder(label: string, path: any) {
      const currentContent = editorState.getCurrentContent()
      const selection = editorState.getSelection()
      const entityKey = Entity.create('PLACEHOLDER', 'IMMUTABLE', path)
      const textWithEntity = Modifier.replaceText(
        currentContent,
        selection,
        label,
        undefined,
        entityKey
      )
      const newEditorState = EditorState.push(
        editorState,
        textWithEntity,
        'insert-characters'
      )
      onChange(convertToRaw(newEditorState.getCurrentContent()))
      setEditorState(newEditorState)
    }
    const [editorState, setEditorState] = React.useState(
      EditorState.createWithContent(
        convertFromRaw(convertInitialContent(initialValue)),
        decorator
      )
    )
    const [modelStructures, setModelStructures] = useState<{
      [key: string]: DataStructure
    }>({})
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
    const { structuredComponents: components } = useProjectComponents()
    const { data: packageData } = useGetPackagesQuery()
    const [dataStructure, setDataStructure] = useState<MenuStructure[]>([])
    const extractModelName = useCallback(
      (parameter: string): [string, boolean] => {
        const models =
          projectData?.getProject.serverConfig.apiConfig.models || []
        const model = models.find(model => model._id === parameter)
        if (model) {
          return [model.name, true]
        }
        return [parameter, false]
      },
      [projectData]
    )
    useEffect(() => {
      if (packageData && components && componentData) {
        const dataComponents = [] as Array<{
          packageName: string
          componentName: string
          data: string
          type: string
        }>

        // find all packages that emit data
        packageData.getPackages.forEach(p => {
          const components = p.components
          const findDataBound = (
            schema: Schema,
            propKey: string,
            packageName: string,
            componentName: string
          ) => {
            switch (schema.type) {
              case 'ui-component':
              case 'layout-component':
              case 'object':
                if (!schema.properties) {
                  return
                }
                Object.keys(schema.properties).forEach(key => {
                  findDataBound(
                    schema.properties[key],
                    key,
                    packageName,
                    componentName
                  )
                })
                break
              case 'string':
              case 'number':
              case 'boolean':
                if (schema.dataBound) {
                  dataComponents.push({
                    packageName,
                    componentName,
                    data: propKey,
                    type: schema.type,
                  })
                }
                break
            }
            return false
          }
          components.forEach(component =>
            findDataBound(component.schema, '', p.packageName, component.name)
          )

          // return p.components
          //   .filter(c => !!c.schema.data)
          //   .flatMap(c =>
          //     Object.keys(c.schema.data).map(key => ())
          //   )
        })

        // find all components with accessible data
        const structure = [] as MenuStructure[]
        if (projectData?.getProject.serverConfig.authConfig.tableId) {
          structure.push({
            type: 'LOCAL_DATA',
            label: 'Current User',
            hasSubMenu: true,
            entity: projectData?.getProject.serverConfig.authConfig.tableId,
            source: 'CurrentUser',
          })
        }
        structure.push({
          type: 'INPUT',
          label: 'Inputs',
          hasSubMenu: true,
          entity: 'InputObject',
          source: 'InputObject',
        })
        const modelStructure = {} as { [key: string]: DataStructure }
        modelStructure.InputObject = {
          _id: 'InputObject',
          name: 'Inputs',
          fields: components.map(c => ({
            type: 'INPUT',
            entity: c._id,
            hasSubMenu: !!(c.children && c.children.length > 0),
            source: c._id,
            label: c.name,
          })),
        }

        const search = (c: Component) => {
          modelStructure[c._id] = {
            _id: c._id,
            name: c.name,
            fields: [],
          }
          c.children?.forEach(ch => {
            if (ch.children && ch.children.length > 0) {
              modelStructure[c._id].fields.push({
                type: 'INPUT',
                source: ch._id,
                entity: ch._id,
                label: ch.name,
                hasSubMenu: !!(ch.children && ch.children.length > 0),
              })
            }
            dataComponents
              .filter(
                dc =>
                  dc.packageName === ch.package && dc.componentName === ch.type
              )
              .forEach(dc =>
                modelStructure[c._id].fields.push({
                  type: 'INPUT',
                  source: `${ch._id}+${dc.data}`,
                  hasSubMenu: false,
                  entity: ch._id,
                  label: `${ch.name}'s ${dc.data}`,
                })
              )
          })
          if (c.children) {
            c.children.forEach(ch => search(ch))
          }
        }
        components.forEach(c => search(c))

        structure.push({
          type: 'ASSET',
          label: 'Assets',
          hasSubMenu: true,
          entity: 'AssetObject',
          source: 'AssetObject',
        })
        modelStructure.AssetObject = {
          _id: 'AssetObject',
          name: 'Assets',
          fields: Object.keys(folderData || {}).map(subKey => ({
            type: 'ASSET',
            entity: subKey,
            hasSubMenu: true,
            source: subKey,
            label: subKey,
          })),
        }

        const flattenAssets = (
          folderName: string,
          folderStructure: FolderStructure
        ) => {
          modelStructure[folderName] = {
            _id: folderName,
            name: folderName,
            fields: [],
          }
          Object.keys(folderStructure[folderName] || {}).forEach(subKey => {
            const currentFolder = folderStructure[folderName]!
            modelStructure[folderName].fields.push({
              type: 'ASSET',
              label: subKey,
              source: subKey,
              entity: subKey,
              hasSubMenu: !!currentFolder[subKey],
            })
            if (currentFolder) {
              flattenAssets(subKey, currentFolder)
            }
          })
        }
        Object.keys(folderData).forEach(key => flattenAssets(key, folderData))

        projectData?.getProject.serverConfig.apiConfig.models.forEach(item => {
          modelStructure[item._id] = {
            _id: item._id,
            name: item.name,
            fields: [
              {
                type: 'SERVER_DATA',
                entity: 'string',
                hasSubMenu: false,
                source: '_id',
                label: 'ID',
              },
              ...item.fields
                .filter(field => !field.isList) // don't add lists for now
                .map(field => ({
                  type: 'SERVER_DATA' as 'SERVER_DATA',
                  entity: field.dataType,
                  hasSubMenu: !!field.connection,
                  source: field._id,
                  label: field.fieldName,
                })),
            ],
          }
        })
        const dataContextBuilder = [] as Array<{
          type: SourceType
          entity: string
          label: string
          source: string
        }>
        const buildRecusiveParentData = (c: any) => {
          const parent = componentData.getComponents.find(
            p => p._id === c.parent
          )
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

        const component = componentData.getComponents.find(
          c => c._id === componentId
        )
        if (component) {
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
        setDataStructure(structure)
        setModelStructures(modelStructure || {})
      }
    }, [
      extractModelName,
      projectData,
      packageData,
      components,
      folderData,
      componentData,
      componentId,
    ])
    return (
      <EditorWrapper
        style={{
          borderColor: editorFocused ? 'var(--accent)' : 'var(--black)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          wordBreak: 'break-word',
        }}
      >
        <Editor
          onFocus={e => setEditorFocused(true)}
          onBlur={e => {
            setEditorFocused(false)
          }}
          editorState={editorState}
          onChange={e => {
            onChange(convertToRaw(editorState.getCurrentContent()))
            setEditorState(e)
          }}
          ref={ref}
        />

        <DataBinder
          onSelect={(entity, value) => {
            if (value.length > 0) {
              const last = value[value.length - 1]
              insertPlaceholder(last.label, value)
            }
          }}
          entry={dataStructure}
          dataStructure={modelStructures}
        />
      </EditorWrapper>
    )
  }

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: 300,
    cursor: 'text',
  },
  placeholder: {
    color: 'var(--accent)',
    textDecoration: 'underline',
    fontWeight: '600',
    display: 'inline-block',
  },
}

export default TextInputBinding
