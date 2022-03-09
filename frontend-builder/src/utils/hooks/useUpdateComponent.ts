import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  ComponentInput,
  GetComponentsDocument,
  useUpdateComponentMutation,
} from '../../generated/graphql'

type UpdateFunc = (id: string, value: ComponentInput) => void

export const useUpdateComponent = (): UpdateFunc => {
  const { projectId } = useParams()
  const [updateComponent] = useUpdateComponentMutation({
    refetchQueries: [
      { query: GetComponentsDocument, variables: { projectId } },
    ],
  })

  const updateFunc = useCallback<UpdateFunc>(
    (id, value) => {
      updateComponent({
        variables: {
          componentId: id,
          componentInput: value,
        },
      })
    },
    [updateComponent]
  )

  return updateFunc
}
