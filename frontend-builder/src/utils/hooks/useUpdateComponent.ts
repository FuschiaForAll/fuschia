import { useContext, useCallback } from 'react'
import { updateLayer, getLocation } from '../updating'
import { Layer as LayerType } from '@fuchsia/types'
import AppContext from '../app-context'

type UpdateFunc = (id: string, value: LayerType) => void

export const useUpdateComponent = (): UpdateFunc => {
  const { body, setBody } = useContext(AppContext)

  const updateFunc = useCallback<UpdateFunc>(
    (id, value) => {
      const location = getLocation(body, id)
      const result = updateLayer(body, location, value)
      setBody(result)
    },
    [body, setBody]
  )

  return updateFunc
}
