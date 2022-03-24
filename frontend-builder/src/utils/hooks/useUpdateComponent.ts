import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  ComponentInput,
  GetComponentsDocument,
  useUpdateComponentMutation,
} from '../../generated/graphql'
import { useDesignerHistory } from './useDesignerHistory'

type UpdateFunc = (
  id: string,
  newvalue: ComponentInput,
  oldvalue: ComponentInput
) => void

export const useUpdateComponent = (): UpdateFunc => {
  const { projectId } = useParams()
  const { performAction } = useDesignerHistory()
  const [updateComponent] = useUpdateComponentMutation({
    refetchQueries: [
      { query: GetComponentsDocument, variables: { projectId } },
    ],
  })

  const updateFunc = useCallback<UpdateFunc>(
    (id, newvalue, oldvalue) => {
      performAction({
        up: () =>
          updateComponent({
            variables: {
              componentId: id,
              componentInput: newvalue,
            },
          }),
        down: () =>
          updateComponent({
            variables: {
              componentId: id,
              componentInput: oldvalue,
            },
          }),
      })
      updateComponent({
        variables: {
          componentId: id,
          componentInput: newvalue,
        },
      })
    },
    [performAction, updateComponent]
  )

  return updateFunc
}
