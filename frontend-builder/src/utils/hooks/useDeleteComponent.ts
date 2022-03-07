import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDeleteComponentsMutation } from '../../generated/graphql'
import { useSelection } from './useSelection'

type DeleteFunc = (...ids: string[]) => void

export const useDeleteComponent = (): DeleteFunc => {
  const { selection, setSelection } = useSelection()
  const [deleteComponents] = useDeleteComponentsMutation({
    update(cache, { data }) {
      cache.modify({
        fields: {
          getComponents(existingComponents = [], { readField }) {
            return [
              ...(existingComponents as any[]).filter(item => {
                return data?.deleteComponents.find(
                  id => readField('_id', item) !== id
                )
              }),
            ]
          },
        },
      })
    },
  })
  const { projectId } = useParams()

  const deleteFunc = useCallback<DeleteFunc>(
    (...ids) => {
      deleteComponents({
        variables: {
          projectId,
          componentIds: ids,
        },
      })

      setSelection(
        selection?.filter((id: string): boolean => !ids.includes(id))
      )
    },
    [deleteComponents, projectId, setSelection, selection]
  )

  return deleteFunc
}
