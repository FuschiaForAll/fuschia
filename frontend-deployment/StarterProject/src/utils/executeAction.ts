import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

export function useExecuteAction() {
  const navigate = useNavigation<any>()

  const createAction = useCallback(() => {}, [])
  const updateAction = useCallback(() => {}, [])
  const deleteAction = useCallback(() => {}, [])
  const navigateAction = useCallback(
    (destination: string) => {
      navigate(destination)
    },
    [navigate]
  )

  return {
    createAction,
  }
}
