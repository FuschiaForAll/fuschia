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

function convertInitialContent(content: string) {
  try {
    const jsonContent = JSON.parse(content)
    if (jsonContent.blocks) {
      return jsonContent
    } else {
      return {
        blocks: [],
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
  } catch {
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
  initialValue: string
  onChange: (value: string) => void
  componentId: string
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

      setEditorState(
        EditorState.push(editorState, textWithEntity, 'insert-characters')
      )
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
      if (dataContextData) {
        const modelStruct =
          projectData?.getProject.appConfig.apiConfig.models.reduce(
            (acc, item) => {
              acc[item._id] = {
                _id: item._id,
                name: item.name,
                fields: item.fields
                  .filter(field => !field.isList) // don't add lists for now
                  .map(field => ({
                    dataType: field.dataType,
                    hasSubMenu: !!field.connection,
                    key: field._id,
                    name: field.fieldName,
                  })),
              }
              return acc
            },
            {} as {
              [key: string]: DataStructure
            }
          )
        setModelStructures(modelStruct || {})

        const structure = dataContextData.getDataContext.reduce((acc, item) => {
          item.dataSources.forEach(source => {
            const [name, hasSubMenu] = extractModelName(source)
            acc.push({
              source: item.componentId,
              entity: source,
              label: `${item.name}'s ${name}`,
              hasSubMenu,
            })
          })
          return acc
        }, [] as MenuStructure[])
        setDataStructure(structure)
      }
    }, [dataContextData, extractModelName, projectData])
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
            onChange(
              JSON.stringify(convertToRaw(editorState.getCurrentContent()))
            )
            setEditorState(e)
          }}
          ref={ref}
        />

        <DataBinder
          onSelect={(entityPath, labelPath) => {
            const name = labelPath.split('.').pop()
            if (name) {
              insertPlaceholder(name, {
                entityPath,
                labelPath,
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
