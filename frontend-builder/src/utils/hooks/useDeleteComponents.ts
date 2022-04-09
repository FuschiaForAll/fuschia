import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDeleteComponentsMutation } from '../../generated/graphql'

type DeleteFunc = (...ids: string[]) => void

export const useDeleteComponents = (): DeleteFunc => {
  const { projectId } = useParams()
  const [deleteComponents] = useDeleteComponentsMutation()

  const deleteComponentFunc = useCallback<DeleteFunc>(
    (...ids) => {
      deleteComponents({
        variables: {
          projectId,
          componentIds: ids,
        },
      })
    },
    [deleteComponents, projectId]
  )

  return deleteComponentFunc
}
