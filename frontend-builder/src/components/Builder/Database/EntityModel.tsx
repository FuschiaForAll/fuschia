import React, { useState } from 'react'
import {
  GetProjectDocument,
  useCreateDataFieldMutation,
  useDeleteDataFieldMutation,
} from '../../../generated/graphql'

const DATA_TYPES = ['String', 'Date', 'Int', 'Float', 'Boolean']

interface EntityModelProps {
  projectId: string
  model: {
    _id: string
    name: string
    fields: Array<{
      _id: string
      fieldName: string
      isUnique: boolean
      isHashed: boolean
      nullable: boolean
      dataType: string
    }>
  }
}

export function EntityModel({ projectId, model }: EntityModelProps) {
  const [fieldName, setFieldName] = useState('')
  const [dataType, setDataType] = useState('String')
  const [isHashed, setIsHashed] = useState(false)
  const [isUnique, setIsUnique] = useState(false)
  const [nullable, setNullable] = useState(true)
  const [createDataField] = useCreateDataFieldMutation({
    refetchQueries: [{ query: GetProjectDocument, variables: { projectId } }],
  })
  const [deleteDataField] = useDeleteDataFieldMutation({
    refetchQueries: [{ query: GetProjectDocument, variables: { projectId } }],
  })
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Field Name</th>
            <th>Data type</th>
            <th>Unique?</th>
            <th>Hashed?</th>
            <th>Nullable?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {model.fields.map(field => (
            <tr key={field._id}>
              <td>{field.fieldName}</td>
              <td>{field.dataType}</td>
              <td>
                <input type="checkbox" readOnly checked={field.isUnique} />
              </td>
              <td>
                <input type="checkbox" readOnly checked={field.isHashed} />
              </td>
              <td>
                <input type="checkbox" readOnly checked={field.nullable} />
              </td>
              <td>
                <button
                  onClick={() => {
                    deleteDataField({
                      variables: {
                        projectId,
                        entityModelId: model._id,
                        dataFieldId: field._id,
                      },
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
            <td>
              <input
                type="text"
                value={fieldName}
                onChange={e => {
                  const name = e.target.value
                  setFieldName(name)
                }}
              />
            </td>
            <td>
              <select
                value={dataType}
                onChange={e => {
                  const type = e.target.value
                  setDataType(type)
                }}
              >
                {DATA_TYPES.map(type => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="checkbox"
                checked={isUnique}
                onChange={e => {
                  const value = e.target.checked
                  setIsUnique(value)
                }}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={isHashed}
                onChange={e => {
                  const value = e.target.checked
                  setIsHashed(value)
                }}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={nullable}
                onChange={e => {
                  const value = e.target.checked
                  setNullable(value)
                }}
              />
            </td>
            <td>
              <button
                onClick={async () => {
                  await createDataField({
                    variables: {
                      projectId,
                      entityModelId: model._id,
                      dataField: {
                        fieldName,
                        dataType,
                        isHashed,
                        isUnique,
                        nullable,
                      },
                    },
                  })
                  setIsHashed(false)
                  setIsUnique(false)
                  setNullable(false)
                  setFieldName('')
                  setDataType('String')
                }}
              >
                New Field
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
