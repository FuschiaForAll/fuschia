import { Props, PositionSchema } from '@fuchsia/types'
import TextInputBinding from '../../../Shared/TextInputBinding'
export type PositionEditorProps = Props<PositionSchema, any>

const PositionEditor = function StringEditor(props: PositionEditorProps) {
  const position = props.initialValue
    ? props.initialValue
    : {
        left: '0px',
        right: '0px',
        top: '0px',
        bottom: '0px',
      }
  return (
    <div>
      <div
        style={{
          fontSize: '0.75rem',
        }}
      >
        {props.schema.title}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5em',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5em',
            alignItems: 'center',
          }}
        >
          <span>L</span>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={position.left}
            onChange={value => {
              position.left = value
              props.updateValue(position, true)
            }}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5em',
            alignItems: 'center',
          }}
        >
          <span>R</span>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={position.right}
            onChange={value => {
              position.right = value
              props.updateValue(position, true)
            }}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5em',
            alignItems: 'center',
          }}
        >
          <span>T</span>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={position.top}
            onChange={value => {
              position.top = value
              props.updateValue(position, true)
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5em',
            alignItems: 'center',
          }}
        >
          <span>B</span>
          <TextInputBinding
            componentId={props.componentId}
            initialValue={position.bottom}
            onChange={value => {
              position.bottom = value
              props.updateValue(position, true)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default PositionEditor
