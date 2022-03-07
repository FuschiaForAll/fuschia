import { useContext, useCallback } from 'react'
import { Layer as LayerType } from '@fuchsia/types'
import AppContext from '../app-context'
import { insertLayer, updateLayer, getLocation } from '../updating'
import { useSelection } from '../hooks/useSelection'

type InsertFunc = (id: string, value: LayerType, insertAfter?: boolean) => void

export const useInsert = (): InsertFunc => {
  const { body, setBody } = useContext(AppContext)
  const { setSelection } = useSelection()

  const insertFunc = useCallback<InsertFunc>(
    (id, value, insertAfter = false) => {
      const location = getLocation(body, id)
      const result = insertLayer(body, location, value, insertAfter)
      setBody(result)
      setSelection([value.id])
    },
    [body, setBody, setSelection]
  )

  return insertFunc
}
