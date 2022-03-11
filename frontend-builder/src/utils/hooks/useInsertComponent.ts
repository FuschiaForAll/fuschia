import { useCallback } from 'react'
import { useSelection } from '../hooks/useSelection'
import { useParams } from 'react-router-dom'
import {
  ComponentInput,
  useCreateComponentMutation,
  GetComponentsDocument,
} from '../../generated/graphql'

type InsertFunc = (value: ComponentInput) => void

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
      debugger
      const newComponent = await createComponent({
        variables: {
          projectId,
          componentInput,
        },
      })
      if (newComponent.data) {
        setSelection([newComponent.data.createComponent._id])
      }
    },
    [createComponent, projectId, setSelection]
  )

  return insertFunc
}
