import type { AppBody, LayerType } from '@fuchsia/types'

export type Location = number[]
export type OptionalLocation = Location | undefined

// Slow & inefficient b/c no index
// TODO: add local cached index
export const getLocation = (body: AppBody, id: string): OptionalLocation => {
  return getLocationSub(body.objects, id)
}

// Recursive function
const getLocationSub = (
  layers: Array<LayerType>,
  id: string
): OptionalLocation => {
  for (let i = 0; i < layers.length; i += 1) {
    const layer = layers[i]

    if (layer.id === id) {
      return [i]
    } else if (layer.children) {
      const childResult = getLocationSub(layer.children, id)

      if (childResult) {
        return [i].concat(childResult)
      }
    }
  }
}

// Update Layer at Location
export const updateLayer = (
  body: AppBody,
  location: OptionalLocation,
  value: LayerType
): AppBody => {
  if (!location) return body

  return {
    ...body,
    objects: updateSub(body.objects, location, value),
  }
}

const updateSub = (
  layers: LayerType[],
  location: Location,
  value: LayerType
): LayerType[] => {
  const result = layers.slice()
  const index = location[0]

  let newValue: LayerType | undefined

  if (location.length === 0) {
    return layers
  } else if (location.length === 1) {
    newValue = value
  } else if (result[index].children) {
    newValue = {
      ...result[index],
      children: updateSub(result[index].children!, location.slice(1), value),
    }
  }

  if (newValue) {
    result.splice(index, 1, newValue)
  }

  return result
}

// Delete Layer at Location
export const deleteLayer = (
  body: AppBody,
  location: OptionalLocation
): AppBody => {
  if (!location) return body

  return {
    ...body,
    objects: deleteSub(body.objects, location),
  }
}

const deleteSub = (layers: LayerType[], location: Location): LayerType[] => {
  const result = layers.slice()
  const index = location[0]

  if (location.length === 0) {
    return layers
  } else if (location.length === 1) {
    result.splice(index, 1)
  } else if (result[index].children) {
    const layer = result[index]

    const children = deleteSub(layer.children!, location.slice(1))

    result.splice(index, 1, {
      ...layer,
      children,
    })
  }

  return result
}

// Insert Layer at Location
export const insertLayer = (
  body: AppBody,
  location: OptionalLocation,
  value: LayerType,
  insertAfter: boolean = false
): AppBody => {
  if (!location) return body

  return {
    ...body,
    objects: insertSub(body.objects, location, value, insertAfter),
  }
}

const insertSub = (
  layers: LayerType[],
  location: Location,
  value: LayerType,
  insertAfter: boolean
): LayerType[] => {
  const result = layers.slice()
  const index = location[0]

  if (location.length === 0) {
    return layers
  } else if (location.length === 1) {
    const insertIndex = index + (insertAfter ? 1 : 0)

    result.splice(insertIndex, 0, value)
  } else if (result[index].children) {
    const layer = result[index]

    const children = insertSub(
      layer.children!,
      location.slice(1),
      value,
      insertAfter
    )

    result.splice(index, 1, {
      ...layer,
      children,
    })
  }

  return result
}
