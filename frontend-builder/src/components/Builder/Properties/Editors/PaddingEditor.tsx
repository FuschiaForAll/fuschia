import { Props, PaddingSchema } from '@fuchsia/types'
import TextInputBinding from '../../../Shared/TextInputBinding'
export type PaddingEditorProps = Props<PaddingSchema, any>

const PaddingEditor = function StringEditor(props: PaddingEditorProps) {
  const padding = props.initialValue
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
            initialValue={padding.left}
            onChange={value => {
              padding.left = value
              props.updateValue(padding, true)
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
            initialValue={padding.right}
            onChange={value => {
              padding.right = value
              props.updateValue(padding, true)
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
            initialValue={padding.top}
            onChange={value => {
              padding.top = value
              props.updateValue(padding, true)
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
            initialValue={padding.bottom}
            onChange={value => {
              padding.bottom = value
              props.updateValue(padding, true)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default PaddingEditor
