import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  ComponentInput,
  GetComponentsDocument,
  useUpdateComponentMutation,
  useUpdateComponentPropsMutation,
} from '../../generated/graphql'
import { useDesignerHistory } from './useDesignerHistory'

type UpdateFunc = (
  id: string,
  newvalue: ComponentInput,
  oldvalue: ComponentInput
) => void

type UpdatePropsFunc = (id: string, newvalue: Object, oldvalue: Object) => void

interface useUpdateComponentProps {
  updateComponent: UpdateFunc
  updateComponentProps: UpdatePropsFunc
}

export const useUpdateComponent = (): useUpdateComponentProps => {
  const { projectId } = useParams()
  const { performAction } = useDesignerHistory()
  const [updateComponentProps] = useUpdateComponentPropsMutation()
  const [updateComponent] = useUpdateComponentMutation({
    refetchQueries: [
      { query: GetComponentsDocument, variables: { projectId } },
    ],
  })

  const updatePropFunc = useCallback<UpdateFunc>(
    (id, newvalue, oldvalue) => {
      performAction({
        up: () =>
          updateComponentProps({
            variables: {
              componentId: id,
              props: newvalue,
            },
          }),
        down: () =>
          updateComponentProps({
            variables: {
              componentId: id,
              props: oldvalue,
            },
          }),
      })
      updateComponentProps({
        variables: {
          componentId: id,
          props: newvalue,
        },
      })
    },
    [performAction, updateComponentProps]
  )

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

  return { updateComponent: updateFunc, updateComponentProps: updatePropFunc }
}
