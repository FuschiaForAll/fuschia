import React, { useEffect, useState } from 'react'
import { EntityModel } from '../../../generated/graphql'

interface DataEditorProps {
  model: EntityModel
}

const DataEditor: React.FC<DataEditorProps> = function DataEditor({ model }) {
  const [data, setData] = useState<any[]>([])
  const [keys, setKeys] = useState<any[]>([])
  const [newData, setNewData] = useState<any>({})
  useEffect(() => {
    if (model) {
      setKeys(model.fields.map(field => field.fieldName))
      fetch('http://localhost:4005', {
        method: 'POST',
        body: JSON.stringify({
          operationName: `List${model.name}`,
          query: `
          query List${model.name} {
            list${model.name} {
                nextToken
                items {
                    _id
                    ${model.fields.map(field => field.fieldName).join('\n')}
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
    }
  }, [model])
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name
    const value = e.target.value
    setNewData((data: any) => ({ ...data, [field]: value }))
    console.log(field)
    console.log(value)
  }
  return (
    <div>
      <h1>Edit Data</h1>
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
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>{item._id}</td>
                {keys.map(key => (
                  <td key={key}>{item[key]}</td>
                ))}
                <td>
                  <button
                    onClick={() => {
                      fetch('http://localhost:4005', {
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
                      })
                        .then(res => res.json())
                        .then(result => {
                          setData(data => data.filter(i => i._id !== item._id))
                        })
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              {keys.map(key => (
                <td key={key}>
                  <input type="text" name={key} onChange={handleInput} />
                </td>
              ))}
              <td>
                <button
                  onClick={() => {
                    fetch('http://localhost:4005', {
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
                    })
                      .then(res => res.json())
                      .then(result => {
                        setData(data => [
                          ...data,
                          {
                            _id: result.data[`create${model.name}`]._id,
                            ...newData,
                          },
                        ])
                        setNewData({})
                      })
                  }}
                >
                  Add
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
      <div>{JSON.stringify(newData)}</div>
    </div>
  )
}

export default DataEditor
