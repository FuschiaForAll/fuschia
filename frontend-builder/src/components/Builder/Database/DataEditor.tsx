import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { EntityModel } from '../../../generated/graphql'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import { TextInput } from '../../Shared/primitives/TextInput'
import { Add } from '@mui/icons-material'

const StyledTable = styled.table`
  border-spacing: 0;
  > tbody > tr > td {
    border-top: solid 1px #c7c7c7;
    border-left: solid 1px #c7c7c7;
    padding: 0.25rem;
  }
  > tbody > tr:last-child > td {
    border-bottom: solid 1px #c7c7c7;
  }
  > tbody > tr > td:last-child {
    border-right: solid 1px #c7c7c7;
  }
  > thead > tr > th {
    background-color: #fafbfb;
    padding: 0.25rem;
    border-top: solid 1px #c7c7c7;
    border-left: solid 1px #c7c7c7;
  }
  > thead > tr > th:last-child {
    border-right: solid 1px #c7c7c7;
  }
  > tfoot > tr > td {
    border-bottom: solid 1px #c7c7c7;
    border-left: solid 1px #c7c7c7;
    padding: 0.25rem;
  }
  > tfoot > tr > td:last-child {
    border-right: solid 1px #c7c7c7;
  }
`

interface DataEditorProps {
  model?: EntityModel
  models?: EntityModel[]
  sandboxEndpoint?: string | null
  liveEndpoint?: string | null
}

const defaultData = {
  String: '',
  Int: 0,
  Float: 0,
  Boolean: true,
  Date: new Date(),
}

const DataEditor: React.FC<DataEditorProps> = function DataEditor({
  model,
  models,
  sandboxEndpoint,
  liveEndpoint,
}) {
  const [sandboxMode, setSandboxMode] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [keys, setKeys] = useState<any[]>([])
  const [newData, setNewData] = useState<any>({})
  useEffect(() => {
    if (model && models) {
      setKeys(
        model.fields
          .filter(field => !field.connection)
          .map(field => field.fieldName.replaceAll(' ', ''))
      )
      const newDataStructure = model.fields.reduce((acc, field) => {
        acc[field.fieldName.replaceAll(' ', '')] =
          defaultData[field.dataType as keyof typeof defaultData]
        return acc
      }, {} as any)
      setNewData(newDataStructure)
      fetch(sandboxMode ? sandboxEndpoint || '' : liveEndpoint || '', {
        method: 'POST',
        body: JSON.stringify({
          operationName: `List${model.name}`,
          query: `
          query List${model.name} {
            list${model.name} {
                nextToken
                items {
                    _id
                    ${model.fields
                      .map(field => {
                        if (field.connection) {
                          const connectedModel = models.find(
                            m => m._id === field.dataType
                          )
                          if (connectedModel) {
                            const connectionBuilder = [] as string[]
                            connectionBuilder.push(
                              `${field.fieldName.replaceAll(' ', '')} {`
                            )
                            if (field.isList) {
                              connectionBuilder.push(`nextToken\nitems {\n`)
                            }
                            connectedModel.fields.forEach(connectedField => {
                              // for now just prevent recussion
                              if (!connectedField.connection) {
                                connectionBuilder.push(
                                  connectedField.fieldName.replaceAll(' ', '')
                                )
                              }
                            })
                            if (field.isList) {
                              connectionBuilder.push(`}`)
                            }
                            connectionBuilder.push('}')
                            return connectionBuilder.join('\n')
                          }
                          return ''
                        } else {
                          return field.fieldName.replaceAll(' ', '')
                        }
                      })
                      .join('\n')}
                }
            }
        }
          `,
          variables: {},
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(result => {
          setData(result.data[`list${model.name}`].items)
        })
        .catch(e => console.log(e))
    }
  }, [model, liveEndpoint, sandboxEndpoint, sandboxMode, models])
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name
    const value = e.target.value
    setNewData((data: any) => ({ ...data, [field]: value }))
  }
  if (!model) {
    return <div>Please select a model</div>
  }
  return (
    <div>
      <label htmlFor="sandboxMode">Use Sandbox Mode?</label>
      <input
        name="sandboxMode"
        type="checkbox"
        checked={sandboxMode}
        onChange={e => {
          const value = e.target.checked
          setSandboxMode(value)
        }}
      />
      {data && (
        <StyledTable>
          <thead>
            <tr>
              <th>ID</th>
              {keys.map(key => (
                <th key={key}>{key}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map(
              (item, idx) =>
                item && (
                  <tr key={idx}>
                    <td>{item._id}</td>
                    {keys.map(key => (
                      <td key={key}>{item[key]}</td>
                    ))}
                    <td>
                      <IconButton
                        onClick={() => {
                          fetch(
                            sandboxMode
                              ? sandboxEndpoint || ''
                              : liveEndpoint || '',
                            {
                              method: 'POST',
                              body: JSON.stringify({
                                operationName: `Delete${model.name}`,
                                query: `
                        mutation Delete${model.name}($input: Delete${model.name}Input!) {
                          delete${model.name}(input: $input) {
                            _id
                          }
                      }
                        `,
                                variables: {
                                  input: { _id: item._id },
                                },
                              }),
                              headers: {
                                'Content-Type': 'application/json',
                              },
                            }
                          )
                            .then(res => res.json())
                            .then(result => {
                              setData(data =>
                                data.filter(i => i._id !== item._id)
                              )
                            })
                            .catch(e => console.log(e))
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                )
            )}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              {keys.map(key => (
                <td key={key}>
                  <TextInput
                    type="text"
                    name={key}
                    value={newData[key]}
                    onChange={handleInput}
                  />
                </td>
              ))}
              <td>
                <IconButton
                  onClick={() => {
                    fetch(
                      sandboxMode ? sandboxEndpoint || '' : liveEndpoint || '',
                      {
                        method: 'POST',
                        body: JSON.stringify({
                          operationName: `Create${model.name}`,
                          query: `
                    mutation Create${model.name}($input: Create${model.name}Input!) {
                      create${model.name}(input: $input) {
                        _id
                      }
                  }
                    `,
                          variables: {
                            input: newData,
                          },
                        }),
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      }
                    )
                      .then(res => res.json())
                      .then(result => {
                        setData(data => [
                          ...data,
                          {
                            _id: result.data[`create${model.name}`]._id,
                            ...newData,
                          },
                        ])
                        const newDataStructure = model.fields.reduce(
                          (acc, field) => {
                            acc[field.fieldName.replaceAll(' ', '')] =
                              defaultData[
                                field.dataType as keyof typeof defaultData
                              ]
                            return acc
                          },
                          {} as any
                        )
                        setNewData(newDataStructure)
                      })
                      .catch((e: any) => console.log(e))
                  }}
                >
                  <Add />
                </IconButton>
              </td>
            </tr>
          </tfoot>
        </StyledTable>
      )}
    </div>
  )
}

export default DataEditor
