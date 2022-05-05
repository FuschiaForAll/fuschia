import React, { useRef, useState } from 'react'
import DataBinder from '../../Builder/Properties/Editors/DataBinder'
import { DataStructure, MenuStructure } from '../CascadingMenu'
import styled from '@emotion/styled'
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
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'

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
  const data = props.contentState
    .getEntity(props.entityKey)
    .getData() as Array<{
    value: string
    label: string
    type: string
  }>
  console.log(`Placeholder`)
  console.log(data)
  return (
    <span
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

export function EntitySelector({
  entities,
  entityId,
  componentId,
  selectedLabel,
  onChange,
  onDelete,
  isList = false,
  dataStructure = {},
}: {
  entities: MenuStructure[]
  dataStructure?: { [key: string]: DataStructure }
  entityId?: string
  componentId: string
  selectedLabel?: string
  onChange: (value: any) => void
  onDelete?: (value: any) => void
  isList?: boolean
}) {
  const [editorFocused, setEditorFocused] = useState(false)
  const ref = useRef<Editor>(null)
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      convertFromRaw(convertInitialContent(selectedLabel)),
      decorator
    )
  )
  function insertPlaceholder(label: string, path: any) {
    const clearEditorState = EditorState.push(
      editorState,
      ContentState.createFromText(''),
      'remove-range'
    )
    const selection = clearEditorState.getSelection()
    const entityKey = Entity.create('PLACEHOLDER', 'IMMUTABLE', path)

    const textWithEntity = Modifier.replaceText(
      clearEditorState.getCurrentContent(),
      selection,
      label,
      undefined,
      entityKey
    )

    const newEditorState = EditorState.push(
      clearEditorState,
      textWithEntity,
      'insert-characters'
    )
    onChange(convertToRaw(newEditorState.getCurrentContent()))
    setEditorState(newEditorState)
  }
  return (
    <>
      <div>{entityId}</div>
      <EditorWrapper
        style={{
          borderColor: editorFocused ? 'var(--accent)' : 'var(--black)',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          wordBreak: 'break-word',
        }}
      >
        <DataBinder
          targetType={entityId}
          onSelect={(entity, value) => {
            if (value.length > 0) {
              const last = value[value.length - 1]
              insertPlaceholder(last.label, value)
            }
          }}
          entry={entities}
          dataStructure={dataStructure}
        />
        <Editor
          onFocus={e => setEditorFocused(true)}
          onBlur={e => {
            setEditorFocused(false)
          }}
          readOnly={true}
          editorState={editorState}
          onChange={e => {
            onChange(convertToRaw(editorState.getCurrentContent()))
            setEditorState(e)
          }}
          ref={ref}
        />
        {onDelete && (
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </EditorWrapper>
    </>
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
