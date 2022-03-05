import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import { useDragDrop, useSelection } from '../../../utils/hooks'
import Layer from './Layer'
import KeyboardEvents from './KeyboardEvents'
import { useGetComponentsQuery } from '../../../generated/graphql'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--canvasBg);
`

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Objects = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`

const Canvas: React.FC = function Canvas() {
  const { projectId } = useParams()
  const [update, setUpdate] = useState(0)
  const { data: componentData } = useGetComponentsQuery({
    variables: {
      projectId,
    },
  })
  const { setSelection } = useSelection()
  useEffect(() => {
    setUpdate(i => i + 1)
  }, [componentData])
  console.log(`Rerenders: ${update}`)
  const { ref } = useDragDrop('main-canvas', {
    droppable: {
      dropClass: '.droppable',
      onDrop: () => {},
    },
  })
  const handleDeselect = useCallback(() => {
    setSelection(undefined)
  }, [setSelection])
  if (!componentData) {
    return <div>Loading...</div>
  }
  console.log('Canvas')
  console.log(componentData.getComponents)
  return (
    <Wrapper id="main-canvas" ref={ref}>
      <KeyboardEvents />
      <Backdrop onMouseDown={handleDeselect} />
      <Objects id="objectCollection">
        {componentData.getComponents.map(obj => (
          // @ts-ignore
          <Layer key={obj._id} layer={obj} />
        ))}
      </Objects>
    </Wrapper>
  )
}

export default Canvas
