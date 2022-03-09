import { gql, useQuery } from '@apollo/client'
import { scaleFactorVar } from '../../apolloClient'

export type Selection = string[] | undefined

interface ScaleOptions {
  zoomOut: () => void
  zoomIn: () => void
  resetZoom: () => void
  zoomFactor: string
}

const scaleFactorQuery = gql`
  query {
    scaleFactor @client
  }
`

const ZOOM_INCEMENT = 0.1

export const useScale = (): ScaleOptions => {
  const { data: scaleFactorData } = useQuery(scaleFactorQuery)
  function zoomOut() {
    if (scaleFactorData.scaleFactor) {
      const currentScale = +scaleFactorData.scaleFactor
      // 0.01 for floating point
      if (currentScale > ZOOM_INCEMENT + 0.01) {
        scaleFactorVar(`${+scaleFactorData.scaleFactor - ZOOM_INCEMENT}`)
      }
    } else {
      resetZoom()
    }
  }
  function zoomIn() {
    if (scaleFactorData.scaleFactor) {
      scaleFactorVar(`${+scaleFactorData.scaleFactor + ZOOM_INCEMENT}`)
    } else {
      resetZoom()
    }
  }
  function resetZoom() {
    scaleFactorVar(`1`)
  }
  return { zoomFactor: scaleFactorData.scaleFactor, zoomOut, zoomIn, resetZoom }
}
