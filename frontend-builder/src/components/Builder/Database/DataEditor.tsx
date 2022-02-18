import React, { useEffect, useState } from 'react'
import { EntityModel } from '../../../generated/graphql'

interface DataEditorProps {
  model: EntityModel
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
  sandboxEndpoint,
  liveEndpoint,
}) {
  const [sandboxMode, setSandboxMode] = useState(true)
  const [data, setData] = useState<any[]>([])
  const [keys, setKeys] = useState<any[]>([])
  const [newData, setNewData] = useState<any>({})
  useEffect(() => {
    if (model) {
      setKeys(model.fields.map(field => field.fieldName.replaceAll(' ', '')))
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
                      .map(field => field.fieldName.replaceAll(' ', ''))
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
  }, [model, liveEndpoint, sandboxEndpoint, sandboxMode])
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name
    const value = e.target.value
    setNewData((data: any) => ({ ...data, [field]: value }))
  }
  return (
    <div>
      <h1>Edit {model.name} Data</h1>

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
        <table>
          <thead>
            <tr>
              <td>ID</td>
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
                      <button
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
                        Delete
                      </button>
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
                  <input
                    type="text"
                    name={key}
                    value={newData[key]}
                    onChange={handleInput}
                  />
                </td>
              ))}
              <td>
                <button
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
                  Add
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}

export default DataEditor
