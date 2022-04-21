import { Props, FlexContainerSchema } from '@fuchsia/types'
import TextInputBinding from '../../../Shared/TextInputBinding'

export type FlexContainerEditorProps = Props<FlexContainerSchema, any>

const FlexContainerEditor = function FlexContainerEditor(
  props: FlexContainerEditorProps
) {
  const flexContainer = props.initialValue
    ? props.initialValue
    : {
        flexDirection: '',
        alignItems: '',
        alignContent: '',
        justifyContent: '',
        justifyItems: '',
        flexWrap: '',
        gap: '',
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
      <div>Flex Direction</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={flexContainer.flexDirection}
        onChange={value => {
          flexContainer.flexDirection = value
          props.updateValue(flexContainer, true)
        }}
      />
      <div>Align Items</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={flexContainer.alignItems}
        onChange={value => {
          flexContainer.alignItems = value
          props.updateValue(flexContainer, true)
        }}
      />
      <div>Align Content</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={flexContainer.alignContent}
        onChange={value => {
          flexContainer.alignContent = value
          props.updateValue(flexContainer, true)
        }}
      />
      <div>Justify Items</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={flexContainer.justifyItems}
        onChange={value => {
          flexContainer.justifyItems = value
          props.updateValue(flexContainer, true)
        }}
      />
      <div>Justify Content</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={flexContainer.justifyContent}
        onChange={value => {
          flexContainer.justifyContent = value
          props.updateValue(flexContainer, true)
        }}
      />
      <div>Wrap</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={flexContainer.flexWrap}
        onChange={value => {
          flexContainer.flexWrap = value
          props.updateValue(flexContainer, true)
        }}
      />
      <div>Gap</div>
      <TextInputBinding
        componentId={props.componentId}
        initialValue={flexContainer.gap}
        onChange={value => {
          flexContainer.gap = value
          props.updateValue(flexContainer, true)
        }}
      />
    </div>
  )
}

export default FlexContainerEditor
