import { gql, useQuery } from '@apollo/client'
import { useCallback } from 'react'
import { selectionVar } from '../../apolloClient'

export type Selection = string[] | undefined

interface SelectionResponse {
  selection: Selection
  setSelection: (selection?: string[]) => void
}

const selectionQuery = gql`
  query getSelection {
    selection @client
  }
`

export const useSelection = (): SelectionResponse => {
  const { data: selectionData } = useQuery(selectionQuery)
  const setSelection = useCallback(selection => {
    const newSelection = selection?.length === 0 ? undefined : selection
    selectionVar(newSelection)
  }, [])

  return { selection: selectionData?.selection, setSelection }
}
