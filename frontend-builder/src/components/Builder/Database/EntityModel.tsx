import { AccordionDetails, AccordionSummary, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import { Lock, AddCircle } from '@mui/icons-material'
import React, { useState } from 'react'
import {
  GetProjectDocument,
  useCreateDataFieldMutation,
  useDeleteDataFieldMutation,
  useUpdateDataFieldMutation,
} from '../../../generated/graphql'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { LabeledTextInput } from '../../Shared/primitives/LabeledTextInput'
import { PRIMITIVE_DATA_TYPES } from '@fuchsia/types'
import { LabeledSelect } from '../../Shared/primitives/LabeledSelect'
import { variableNameRegex } from '../../../utils/regexp'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:before': {
    display: 'none',
  },
}))

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
      isList?: boolean | null
      nullable: boolean
      dataType: string
      connected?: boolean | null
    }>
  }
  models: Array<{ _id: string; name: string }>
}

export function EntityModel({ projectId, model, models }: EntityModelProps) {
  const [fieldName, setFieldName] = useState('')
  const [dataType, setDataType] = useState('String')
  const [isHashed, setIsHashed] = useState(false)
  const [isList, setIsList] = useState(false)
  const [isUnique, setIsUnique] = useState(false)
  const [nullable, setNullable] = useState(true)
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const [createDataField] = useCreateDataFieldMutation({
    refetchQueries: [{ query: GetProjectDocument, variables: { projectId } }],
  })
  const [deleteDataField] = useDeleteDataFieldMutation({
    refetchQueries: [{ query: GetProjectDocument, variables: { projectId } }],
  })
  const [updateDataField] = useUpdateDataFieldMutation({
    refetchQueries: [{ query: GetProjectDocument, variables: { projectId } }],
  })
  const handleAccordianChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }
  return (
    <div>
      {model.fields.map(field => (
        <Accordion
          key={field._id}
          expanded={expanded === field._id.toString()}
          onChange={handleAccordianChange(field._id.toString())}
          elevation={0}
          sx={{
            margin: '0.25rem',
            marginRight: 0,
            background: '#F7F6F6',
            color: expanded === field._id.toString() ? '#DD1C74' : 'black',
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor:
              expanded === field._id.toString() ? '#F24726' : 'black',
            borderRadius: 5,
          }}
        >
          <AccordionSummary>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto auto',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <span>{field.fieldName}</span>
              <span>
                <Lock />
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails sx={{ color: 'black' }}>
            <div>
              <LabeledSelect
                label="Data Type"
                selectedValue={field.dataType}
                onChange={e => {
                  const type = e.target.value
                  updateDataField({
                    variables: {
                      dataField: {
                        dataType: type,
                      },
                      dataFieldId: field._id,
                      entityModelId: model._id,
                      projectId,
                    },
                  })
                }}
                options={[
                  ...PRIMITIVE_DATA_TYPES.map(type => ({
                    label: type,
                    value: type,
                  })),
                  ...models.map(modelType => ({
                    label: modelType.name,
                    value: modelType._id,
                  })),
                ]}
              />
              <div>
                <label htmlFor="isUnique">Is Unique</label>
                <input
                  name="isUnique"
                  type="checkbox"
                  onChange={e => {
                    const value = e.target.checked
                    updateDataField({
                      variables: {
                        dataField: {
                          isUnique: value,
                        },
                        dataFieldId: field._id,
                        entityModelId: model._id,
                        projectId,
                      },
                    })
                  }}
                  checked={field.isUnique}
                />
              </div>
              <div>
                <label htmlFor="isHashed">Is Hashed</label>
                <input
                  name="isHashed"
                  type="checkbox"
                  onChange={e => {
                    const value = e.target.checked
                    updateDataField({
                      variables: {
                        dataField: {
                          isHashed: value,
                        },
                        dataFieldId: field._id,
                        entityModelId: model._id,
                        projectId,
                      },
                    })
                  }}
                  checked={field.isHashed}
                />
              </div>
              <div>
                <label htmlFor="nullable">Is Nullable</label>
                <input
                  name="nullable"
                  type="checkbox"
                  onChange={e => {
                    const value = e.target.checked
                    updateDataField({
                      variables: {
                        dataField: {
                          nullable: value,
                        },
                        dataFieldId: field._id,
                        entityModelId: model._id,
                        projectId,
                      },
                    })
                  }}
                  checked={field.nullable}
                />
              </div>
              <div>
                <label htmlFor="isList">Is List</label>
                <input
                  name="isList"
                  type="checkbox"
                  onChange={e => {
                    const value = e.target.checked
                    updateDataField({
                      variables: {
                        dataField: {
                          isList: value,
                        },
                        dataFieldId: field._id,
                        entityModelId: model._id,
                        projectId,
                      },
                    })
                  }}
                  checked={!!field.isList}
                />
              </div>
              <IconButton
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
                <DeleteIcon />
              </IconButton>
              {/* <IconButton
                onClick={() => {
                  // deleteDataField({
                  //   variables: {
                  //     projectId,
                  //     entityModelId: model._id,
                  //     dataFieldId: field._id,
                  // },
                  // })
                }}
              >
                <EditIcon />
              </IconButton> */}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
      <Accordion
        expanded={expanded === 'new'}
        onChange={handleAccordianChange('new')}
        elevation={0}
        sx={{
          margin: '0.25rem',
          marginRight: 0,
          background: '#F7F6F6',
          color: '#DD1C74',
          border: 'dashed 1px #F24726',
          borderRadius: 5,
        }}
      >
        <AccordionSummary>
          <div className="spaced-and-centered">
            <span>Add new field</span>
            <span>
              <AddCircle />
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <LabeledTextInput
              label="Field Name"
              type="text"
              value={fieldName}
              onChange={e => {
                const name = e.target.value
                if (name === '' || variableNameRegex.test(name)) {
                  setFieldName(name)
                }
              }}
            />
            <LabeledSelect
              label="Data Type"
              selectedValue={dataType}
              onChange={e => {
                const type = e.target.value
                setDataType(type)
              }}
              options={[
                ...PRIMITIVE_DATA_TYPES.map(type => ({
                  label: type,
                  value: type,
                })),
                ...models.map(modelType => ({
                  label: modelType.name,
                  value: modelType._id,
                })),
              ]}
            />
            <div>
              <label>Is Unique</label>
              <input
                type="checkbox"
                checked={isUnique}
                onChange={e => {
                  const value = e.target.checked
                  setIsUnique(value)
                }}
              />
            </div>
            <div>
              <label>Is Hashed</label>
              <input
                type="checkbox"
                checked={isHashed}
                onChange={e => {
                  const value = e.target.checked
                  setIsHashed(value)
                }}
              />
            </div>
            <div>
              <label>Is Nullable</label>
              <input
                type="checkbox"
                checked={nullable}
                onChange={e => {
                  const value = e.target.checked
                  setNullable(value)
                }}
              />
            </div>
            <div>
              <label>Is List</label>
              <input
                type="checkbox"
                checked={isList}
                onChange={e => {
                  const value = e.target.checked
                  setIsList(value)
                }}
              />
            </div>
            <button
              className="outlined-accent-button"
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
                      isList,
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
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
