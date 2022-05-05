export type SourceType =
  | 'LOCAL_DATA'
  | 'SERVER_DATA'
  | 'INPUT'
  | 'PRIMITIVE'
  | 'ASSET'
  | 'VARIABLE'
  | 'DATA_CONTEXT'

export interface EntityData {
  value: string
  label: string
  type: SourceType
}

export function DraftJSEditorConverter(value: any, projectId?: string) {
  if (!value) {
    return ``
  }
  if (typeof value === 'object') {
    if (value.blocks) {
      // draftjs
      if (value.entityMap) {
        for (const key in value.entityMap) {
          if (value.entityMap[key].data) {
            const entityData = value.entityMap[key].data as EntityData[]
            if (entityData[0]) {
              if (entityData[0].type === 'ASSET') {
                const arr = [...entityData]
                arr.shift()
                return `${
                  process.env.REACT_APP_GQL_ENDPOINT
                }/project-files/${projectId}/${arr.map(a => a.value).join('/')}`
              }
            }
          }
        }
      }
      return value.blocks.map((block: any) => block.text).join('\n')
    }
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = DraftJSEditorConverter(value[key], projectId)
      return acc
    }, {} as any)
  } else {
    return value
  }
}

export function DraftJSPreviewerConverter(
  value: any,
  inputState: any,
  entityState: any,
  localState: any,
  dataContext: any,
  projectId: any,
  authTableId: any
) {
  if (!value) {
    return ``
  }
  if (typeof value === 'object') {
    try {
      if (value.blocks) {
        let textParts = [] as string[]
        // update block text, replacing entity ranges
        value.blocks.forEach((block: any) => {
          let currentText = block.text
          ;[...block.entityRanges].reverse().forEach((range: any) => {
            // find out what we are replacing the text with
            let replacementText = ''
            if (value.entityMap && value.entityMap[range.key]) {
              if (value.entityMap[range.key].data) {
                const entityData = value.entityMap[range.key]
                  .data as EntityData[]

                switch (entityData[0].type) {
                  case 'ASSET':
                    const arr = [...entityData]
                    arr.shift()
                    replacementText = `${
                      process.env.REACT_APP_GQL_ENDPOINT
                    }/project-files/${projectId}/${arr
                      .map(a => a.value)
                      .join('/')}`
                    break
                  case 'INPUT':
                    replacementText =
                      inputState[entityData[entityData.length - 1].value]
                    break
                  case 'LOCAL_DATA':
                    // const path = entityData.entityPath?.split('.').pop()
                    // if (path) {
                    //   replacementText = localState[path]
                    // }
                    const data = value.entityMap[range.key].data as Array<{
                      label: string
                      value: string
                      type: SourceType
                    }>
                    const currentValue = data.reduce((acc, d) => {
                      switch (d.type) {
                        case 'LOCAL_DATA':
                          if (d.value === 'CurrentUser') {
                            return entityState[authTableId].find(
                              (r: any) => r._id === localState.CurrentUser
                            )
                          }
                          break
                        case 'SERVER_DATA': {
                          return acc[d.value]
                        }
                      }
                      return 'unknown'
                    }, {} as any)
                    console.log(`currentValue`)
                    console.log(currentValue)
                    if (typeof currentValue === 'object') {
                      replacementText = currentValue._id
                    } else {
                      replacementText = currentValue
                    }
                    break
                  case 'SERVER_DATA':
                    // const path = entityData.entityPath?.split('.').pop()
                    // if (path) {
                    //   if (dataContext[path]) {
                    //     replacementText = dataContext[path]
                    //   }
                    // }
                    replacementText = 'SERVER_DATA'
                    break
                  case 'DATA_CONTEXT':
                    if (dataContext.mappedData) {
                      replacementText =
                        dataContext.mappedData[
                          entityData[entityData.length - 1].value
                        ]
                    } else {
                      replacementText = 'no data'
                    }
                    break
                  default:
                    replacementText = 'AHHHHH'
                    break
                }
              }
            }
            currentText = `${currentText.slice(
              0,
              range.offset
            )}${replacementText}${currentText.slice(
              range.offset + range.length
            )}`
          })
          textParts.push(currentText)
        })
        return textParts.join('\n')
      }
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = DraftJSPreviewerConverter(
          value[key],
          inputState,
          entityState,
          localState,
          dataContext,
          projectId,
          authTableId
        )
        return acc
      }, {} as any)
    } catch (e) {
      console.error(`BINDING ERROR`)
      console.error(e)
    }
  } else {
    return value
  }
  // it might be a property primitive
  if (value.split && dataContext && dataContext[value.split('.').pop()]) {
    return dataContext[value.split('.').pop()]
  }
  return value
}

export function DraftJSBuilderConverter() {}
