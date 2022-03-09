import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'
import { useDragDrop, useSelection } from '../../../utils/hooks'
import Layer from './Layer'
import KeyboardEvents from './KeyboardEvents'
import { useGetComponentsQuery } from '../../../generated/graphql'
import { scaleFactorVar } from '../../../apolloClient'
import { useScale } from '../../../utils/hooks/useScale'

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

const ZOOM_INCEMENT = 0.1

const Canvas: React.FC = function Canvas() {
  const { zoomFactor } = useScale()
  const { projectId } = useParams()
  const [update, setUpdate] = useState(0)
  const objectCollectionRef = useRef<HTMLDivElement>(null)
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
  useEffect(() => {
    if (objectCollectionRef.current) {
      const x =
        parseFloat(objectCollectionRef.current.getAttribute('data-x')!) || 0
      const y =
        parseFloat(objectCollectionRef.current.getAttribute('data-y')!) || 0
      objectCollectionRef.current.style.transform = `translate(${x}px, ${y}px) scale(${zoomFactor})`
      objectCollectionRef.current.setAttribute('data-x', `${x}`)
      objectCollectionRef.current.setAttribute('data-y', `${y}`)
      objectCollectionRef.current.setAttribute('data-z', `${zoomFactor}`)
    }
  }, [zoomFactor])
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (objectCollectionRef.current) {
      const z =
        (parseFloat(objectCollectionRef.current.getAttribute('data-z')!) || 1) +
        (e.deltaY < 0 ? -ZOOM_INCEMENT : ZOOM_INCEMENT)
      if (z > ZOOM_INCEMENT) {
        scaleFactorVar(`${z}`)
      }
    }
  }, [])
  const handleDeselect = useCallback(() => {
    setSelection(undefined)
  }, [setSelection])

  const mouseMove = useCallback((e: MouseEvent) => {
    if (objectCollectionRef.current) {
      const x =
        (parseFloat(objectCollectionRef.current.getAttribute('data-x')!) || 0) +
        e.movementX
      const y =
        (parseFloat(objectCollectionRef.current.getAttribute('data-y')!) || 0) +
        e.movementY
      const z =
        parseFloat(objectCollectionRef.current.getAttribute('data-z')!) || 1
      objectCollectionRef.current.style.transform = `translate(${x}px, ${y}px) scale(${z})`
      objectCollectionRef.current.setAttribute('data-x', `${x}`)
      objectCollectionRef.current.setAttribute('data-y', `${y}`)
    }
  }, [])
  if (!componentData) {
    return <div>Loading...</div>
  }
  console.log('Canvas')
  console.log(componentData.getComponents)
  return (
    <Wrapper
      id="main-canvas"
      ref={ref}
      onMouseDown={e => {
        if (e.button === 1) {
          document.body.addEventListener('mousemove', mouseMove, true)
        }
      }}
      onMouseUp={e => {
        document.body.removeEventListener('mousemove', mouseMove, true)
      }}
      onWheel={handleWheel}
    >
      <KeyboardEvents />
      <Backdrop onMouseDown={handleDeselect} />
      <Objects
        id="objectCollection"
        ref={objectCollectionRef}
        style={{
          transformOrigin: `0 0`,
        }}
      >
        <div id="drag-holder">
          {componentData.getComponents.map(obj => (
            // @ts-ignore
            <Layer key={obj._id} layer={obj} />
          ))}
        </div>
      </Objects>
    </Wrapper>
  )
}

export default Canvas
