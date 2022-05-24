import { Props, MarginSchema } from '@fuchsia/types'
import TextInputBinding from '../../../Shared/TextInputBinding'
export type MarginEditorProps = Props<MarginSchema, any>

const MarginEditor = function StringEditor(props: MarginEditorProps) {
  const margin = props.initialValue
    ? props.initialValue
    : {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
            initialValue={margin.left}
            onChange={value => {
              margin.left = { ...value, type: 'number' }
              props.updateValue(margin, true)
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
            initialValue={margin.right}
            onChange={value => {
              margin.right = { ...value, type: 'number' }
              props.updateValue(margin, true)
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
            initialValue={margin.top}
            onChange={value => {
              margin.top = { ...value, type: 'number' }
              props.updateValue(margin, true)
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
            initialValue={margin.bottom}
            onChange={value => {
              margin.bottom = { ...value, type: 'number' }
              props.updateValue(margin, true)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default MarginEditor
