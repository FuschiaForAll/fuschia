import { Schema } from '@fuchsia/types'
import { ObjectId } from 'mongodb'
import { RawDraftContentState } from 'draft-js'

export interface Project {
  _id: ObjectId
  components: ObjectId[]
  appConfig: {
    appEntryComponentId: ObjectId
    sandboxEndpoint: string
    apiConfig: {
      models: Array<{
        _id: ObjectId
        name: string
        fields: Array<{
          _id: ObjectId
          isUnique: boolean
          isHashed: boolean
          isList: boolean
          nullable: boolean
          connection: boolean
          dataType: string
          fieldName: string
        }>
      }>
    }
    authConfig: {
      requiresAuth: boolean
      tableId: ObjectId
      usernameFieldId: ObjectId
      passwordFieldId: ObjectId
    }
  }
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
  fetched: Array<{
    entityType: string
    path: string
    label: string
    variables: Array<{
      key: string
      value: RawDraftContentState
    }>
  }>
}
