import { AccordionDetails, AccordionSummary, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import { Lock } from '@mui/icons-material'
import React, { useState } from 'react'
import {
  GetProjectDocument,
  useCreateDataFieldMutation,
  useDeleteDataFieldMutation,
} from '../../../generated/graphql'

const DATA_TYPES = ['String', 'Date', 'Int', 'Float', 'Boolean']

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
            color: '#DD1C74',
            border: 'dashed 1px black',
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
              <span>Datatype: {field.dataType}</span>
              <div>
                <label htmlFor="isUnique">Is Unique</label>
                <input
                  name="isUnique"
                  type="checkbox"
                  readOnly
                  checked={field.isUnique}
                />
              </div>
              <div>
                <label htmlFor="isHashed">Is Hashed</label>
                <input
                  name="isHashed"
                  type="checkbox"
                  readOnly
                  checked={field.isHashed}
                />
              </div>
              <div>
                <label htmlFor="nullable">Is Nullable</label>
                <input
                  name="nullable"
                  type="checkbox"
                  readOnly
                  checked={field.nullable}
                />
              </div>
              <div>
                <label htmlFor="isList">Is List</label>
                <input
                  name="isList"
                  type="checkbox"
                  readOnly
                  checked={!!field.isList}
                />
              </div>
              <Button
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
              </Button>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
      <Accordion
        sx={{ display: expanded === 'new' ? 'initial' : 'none' }}
        expanded={expanded === 'new'}
        elevation={0}
      >
        <AccordionSummary>Add New Field</AccordionSummary>
        <AccordionDetails>
          <div>
            <input
              type="text"
              value={fieldName}
              onChange={e => {
                const name = e.target.value
                setFieldName(name)
              }}
            />
            <select
              value={dataType}
              onChange={e => {
                const type = e.target.value
                setDataType(type)
              }}
            >
              {DATA_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
              {models.map(modelType => (
                <option key={modelType._id} value={modelType._id}>
                  {modelType.name}
                </option>
              ))}
            </select>
            <input
              type="checkbox"
              checked={isUnique}
              onChange={e => {
                const value = e.target.checked
                setIsUnique(value)
              }}
            />
            <input
              type="checkbox"
              checked={isHashed}
              onChange={e => {
                const value = e.target.checked
                setIsHashed(value)
              }}
            />
            <input
              type="checkbox"
              checked={nullable}
              onChange={e => {
                const value = e.target.checked
                setNullable(value)
              }}
            />{' '}
            <input
              type="checkbox"
              checked={isList}
              onChange={e => {
                const value = e.target.checked
                setIsList(value)
              }}
            />
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
      <div>
        <Button onClick={e => handleAccordianChange('new')(e, true)}>
          Add New Field
        </Button>
      </div>
    </div>
  )
}
