export interface AppBody {
  objects: Array<LayerType>
}

export interface BaseObject {
  id: string
  type: string
  children?: Array<BaseObject>
}

export interface LayerType extends BaseObject {
  name: string
  layerType: string
  children?: Array<LayerType>
}

export interface Frame extends LayerType {
  x: number
  y: number
  width: number
  height: number
}

export interface Page extends Frame {
  layerType: 'page'
}

export interface Component extends Frame {
  layerType: 'component'
}

export interface InlineLayer extends LayerType {
  options: any
}

export interface TextOptions {
  text: string
  style?: 'h1' | 'h2' | 'h3'
  fontSize?: number
  fontColor?: string
}

export interface TextType extends InlineLayer {
  layerType: 'text'
  options: TextOptions
}
