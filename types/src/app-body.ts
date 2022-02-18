export interface AppBody {
  objects: Array<Layer>
}

export interface BaseObject {
  id: string
  type: string
  children: Array<BaseObject>
}

export interface Layer extends BaseObject {
  name: string
  options: Map<string, any>
}
