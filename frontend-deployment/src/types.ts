import { Schema } from '@fuchsia/types'
import { ObjectId } from 'mongodb'

export interface Project {
  _id: ObjectId
  components: ObjectId[]
  appConfig: { appEntryComponentId: ObjectId }
}

export interface Package {
  _id: ObjectId
  packageName: string
  repositoryUrl: string
  version: string
  components: Array<{
    name: string
    itRootElemenet: boolean
    isContainer: boolean
    schema: Schema
    _id: ObjectId
  }>
  scope: string
}

export interface Component {
  _id: ObjectId
  package: string
  type: string
  name: string
  x: number
  y: number
  isContainer: boolean
  isRootElement: boolean
  parameters: any[]
  props: { [key: string]: any }
  children?: Component[]
  fetched: any[]
}
