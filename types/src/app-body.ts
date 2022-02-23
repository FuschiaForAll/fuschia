export interface AppBody {
  objects: Array<Layer>
}

export interface BaseObject {
  id: string
  type: string
  children?: Array<BaseObject>
}

export interface Layer extends BaseObject {
  name: string
  layerType: string
  children?: Array<Layer>
}

export interface Frame extends Layer {
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
