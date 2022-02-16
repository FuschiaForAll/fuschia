import React, { useEffect, useState } from 'react'
import { DataField, EntityModel } from '../../../generated/graphql'

interface DataEditorProps {
  model: EntityModel
}

const DataEditor: React.FC<DataEditorProps> = function DataEditor({ model }) {
  const [data, setData] = useState<any[]>([])
  const [keys, setKeys] = useState<any[]>([])
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
  return (
    <div>
      <h1>Edit Data</h1>
      {data && (
        <table>
          <thead>
            <tr>
              {keys.map(key => (
                <th key={key}>{key}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                {keys.map(key => (
                  <td key={key}>{item[key]}</td>
                ))}
                <td>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {keys.map(key => (
                <td key={key}>
                  <input type="text" />
                </td>
              ))}
              <td>
                <button>Add</button>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  )
}

export default DataEditor
