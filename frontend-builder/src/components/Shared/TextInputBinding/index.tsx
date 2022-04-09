import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  Entity,
  Modifier,
  CompositeDecorator,
} from 'draft-js'
import styled from '@emotion/styled'
import DataBinder, {
  DataStructure,
  MenuStructure,
} from '../../Builder/Properties/Editors/DataBinder'
import { useParams } from 'react-router-dom'
import {
  useGetProjectQuery,
  useGetDataContextQuery,
} from '../../../generated/graphql'
import { useGetPackagesQuery } from '../../../generated/graphql-packages'
import { useProjectComponents } from '../../../utils/hooks/useProjectComponents'

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
        text: content || '',
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
  const data = props.contentState.getEntity(props.entityKey).getData()
  return (
    <span
      //@ts-ignore
      readOnly={true}
      title={data.labelPath?.split('.').join(' > ')}
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

function findPlaceholders(contentBlock: any, callback: any) {
  contentBlock.findEntityRanges((character: any) => {
    const entityKey = character.getEntity()
    return (
      entityKey !== null && Entity.get(entityKey).getType() === 'PLACEHOLDER'
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
    let { projectId } = useParams<{ projectId: string }>()
    const [modelStructures, setModelStructures] = useState<{
      [key: string]: DataStructure
    }>({})
    const { data: projectData } = useGetProjectQuery({
      variables: {
        projectId,
      },
    })
    const { data: dataContextData } = useGetDataContextQuery({
      variables: {
        componentId,
      },
    })
    const components = useProjectComponents(projectId!)
    const { data: packageData } = useGetPackagesQuery()
    const [dataStructure, setDataStructure] = useState<MenuStructure[]>([])
    const extractModelName = useCallback(
      (parameter: string): [string, boolean] => {
        const models = projectData?.getProject.appConfig.apiConfig.models || []
        const model = models.find(model => model._id === parameter)
        if (model) {
          return [model.name, true]
        }
        return [parameter, false]
      },
      [projectData]
    )
    useEffect(() => {
      if (dataContextData && packageData && components) {
        // find all packages that emit data
        const dataComponents = packageData.getPackages.flatMap(p =>
          p.components
            .filter(c => !!c.schema.data)
            .flatMap(c =>
              Object.keys(c.schema.data).map(key => ({
                packageName: p.packageName,
                componentName: c.name,
                data: key,
                type: c.schema.data[key],
              }))
            )
        )

        // find all components with accessible data
        const structure = [] as MenuStructure[]
        if (projectData?.getProject.appConfig.authConfig.tableId) {
          structure.push({
            type: 'LOCAL_DATA',
            label: 'Current User',
            hasSubMenu: true,
            entity: projectData?.getProject.appConfig.authConfig.tableId,
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
        const modelStructure = {
          InputObject: {
            _id: 'InputObject',
            name: 'Inputs',
            fields: components.map(c => ({
              type: 'INPUT',
              entity: c._id,
              hasSubMenu: !!(c.children && c.children.length > 0),
              source: c._id,
              label: c.name,
            })),
          },
        } as { [key: string]: DataStructure }
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
        console.log(`structure`)
        console.log(structure)

        projectData?.getProject.appConfig.apiConfig.models.forEach(item => {
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
        setModelStructures(modelStructure || {})

        dataContextData.getDataContext.forEach(item => {
          item.dataSources.forEach(source => {
            const [name, hasSubMenu] = extractModelName(source)
            structure.push({
              type: 'SERVER_DATA',
              source: item.componentId,
              entity: source,
              label: `${item.name}'s ${name}`,
              hasSubMenu,
            })
          })
        })
        setDataStructure(structure)
      }
    }, [
      dataContextData,
      extractModelName,
      projectData,
      packageData,
      components,
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
          onSelect={(entity, entityPath, labelPath, type) => {
            const name = labelPath.split('.').pop()
            if (name) {
              insertPlaceholder(name, {
                entityPath,
                labelPath,
                type,
              })
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
