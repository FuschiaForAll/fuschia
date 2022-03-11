import { useCallback } from 'react'
import { useSelection } from '../hooks/useSelection'
import { useParams } from 'react-router-dom'
import {
  ComponentInput,
  useCreateComponentMutation,
  GetComponentsDocument,
} from '../../generated/graphql'
import { Schema } from '@fuchsia/types'
type InsertFunc = (value: ComponentInput) => void

function getDefaultProps(schema: Schema, acc: object) {
  if (schema.type === 'object') {
    return Object.keys(schema.properties).reduce((obj, key) => {
      obj[key] = getDefaultProps(schema.properties[key], {})
      return obj
    }, {} as any)
  }
  return schema.default
}

export const useInsertComponent = (): InsertFunc => {
  const { projectId } = useParams()
  const [createComponent] = useCreateComponentMutation({
    refetchQueries: [
      { query: GetComponentsDocument, variables: { projectId } },
    ],
  })
  const { setSelection } = useSelection()

  const insertFunc = useCallback<InsertFunc>(
    async componentInput => {
      const newComponent = await createComponent({
        variables: {
          projectId,
          componentInput,
        },
      })
      if (newComponent.data) {
        debugger
        setSelection([newComponent.data.createComponent._id])
      }
    },
    [createComponent, projectId, setSelection]
  )

  return insertFunc
}
