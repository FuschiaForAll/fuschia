import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Props, StringSchema } from '@fuchsia/types'
import { LabeledTextInput } from '../../../Shared/primitives/LabeledTextInput'
import { Color, SketchPicker } from 'react-color'
import Box from '@mui/material/Box'
import Popper from '@mui/material/Popper'
import MuiSelect from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import DataBinder, { DataStructure, MenuStructure } from './DataBinder'
import styled from '@emotion/styled'
import Select from '../../../Shared/Select'
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  Entity,
  Modifier,
  CompositeDecorator,
} from 'draft-js'
import {
  useGetDataContextQuery,
  useGetProjectQuery,
} from '../../../../generated/graphql'
import { useParams } from 'react-router-dom'

export type StringEditorProps = Props<StringSchema, string>

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

const ColorPicker = ({
  title,
  defaultValue,
  onChange,
}: {
  title: string
  defaultValue: string
  onChange: (value: string) => void
}) => {
  const [color, setColor] = useState<Color>(defaultValue)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClick = (event: React.FocusEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined
  return (
    <>
      <LabeledTextInput
        label={title}
        value={color?.toString()}
        onFocus={handleClick}
      />

      <Popper id={id} open={open} anchorEl={anchorEl} placement="right">
        <Box sx={{ marginLeft: '0.5em' }}>
          <div
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            }}
            onClick={() => setAnchorEl(null)}
          />
          <SketchPicker
            color={color}
            onChange={color => {
              setColor(color.hex)
              onChange(color.hex)
            }}
          />
        </Box>
      </Popper>
    </>
  )
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
const test = {
  abc123: {
    label: 'Connection Name',
    entityId: 'abc123',
    fields: [{ name: '1', type: 'abc123', hasSubMenu: false }],
  },
}
const StringEditor = function StringEditor(props: StringEditorProps) {
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
      componentId: props.componentId,
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
  const [editorFocused, setEditorFocused] = useState(false)
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      convertFromRaw(convertInitialContent(props.initialValue)),
      decorator
    )
  )
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

  if (props.schema.enum) {
    return (
      <FormControl
        fullWidth={true}
        sx={{ marginTop: '0.5em', marginBottom: '0.5em' }}
      >
        <InputLabel id={`select-${props.schema.title || 'undefined'}-label`}>
          {props.schema.title}
        </InputLabel>
        <MuiSelect
          labelId={`select-${props.schema.title || 'undefined'}-label`}
          label={props.schema.title}
          defaultValue={props.initialValue as string}
          onChange={e => props.updateValue(e.target.value, true)}
        >
          {props.schema.enum.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    )
  }
  switch (props.schema.format) {
    case 'textarea':
      return <textarea />
    case 'color':
      return (
        <ColorPicker
          defaultValue={props.initialValue as string}
          title={props.schema.title || 'undefined'}
          onChange={e => props.updateValue(e, true)}
        />
      )
    case 'ipv4':
      return (
        <>
          <LabeledTextInput
            label={props.schema.title || 'undefined'}
            defaultValue={props.initialValue as string}
            onChange={e => props.updateValue(e.target.value, true)}
          />
        </>
      )
    default:
      return (
        <div>
          <div style={{ fontSize: '0.75rem' }}>{props.schema.title}</div>
          <EditorWrapper
            style={{
              borderColor: editorFocused ? 'var(--accent)' : 'var(--black)',
            }}
          >
            <Editor
              onFocus={e => setEditorFocused(true)}
              onBlur={e => {
                setEditorFocused(false)
              }}
              editorState={editorState}
              onChange={e => {
                props.updateValue(
                  JSON.stringify(convertToRaw(editorState.getCurrentContent())),
                  true
                )
                setEditorState(e)
              }}
              ref={ref}
            />
          </EditorWrapper>
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
        </div>
      )
  }
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

export default StringEditor
