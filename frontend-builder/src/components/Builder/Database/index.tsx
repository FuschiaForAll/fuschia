import { Paper } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import { Add } from '@mui/icons-material'
import {
  useCreateAppVariableMutation,
  useDeleteAppVariableMutation,
  useCreateEntityModelMutation,
  useGetProjectQuery,
  useGetServerStatusQuery,
} from '../../../generated/graphql'
import DataEditor from './DataEditor'
import { EntityModel } from './EntityModel'
import { GetProjectDocument } from '../../../generated/graphql'
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import Modal from '@mui/material/Modal'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { LabeledTextInput } from '../../Shared/primitives/LabeledTextInput'
import { variableNameRegex } from '../../../utils/regexp'
import { MainTabHeader, TabWrapper } from '../../Shared/Tabs'
import { PRIMITIVE_DATA_TYPES } from '@fuchsia/types'
import { LabeledSelect } from '../../Shared/primitives/LabeledSelect'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:before': {
    display: 'none',
  },
}))

function StatusChip({
  label,
  status,
  onClick,
}: {
  label: string
  status?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <Box
      sx={{
        color: status ? 'black' : 'white',
        borderColor: status ? 'var(--success)' : 'var(--error)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        width: 125,
      }}
    >
      <Box
        sx={{
          margin: '2px',
          backgroundColor: status ? 'var(--success)' : 'var(--error)',
          borderRadius: 4,
          padding: '0.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <span>{label}</span>
          {onClick && (
            <IconButton onClick={onClick}>
              {status ? <RestartAltIcon /> : <PlayCircleIcon />}
            </IconButton>
          )}
        </div>
      </Box>
    </Box>
  )
}

function VariableConfiguration({
  selectedPage,
  pageIndex,
}: {
  selectedPage: number
  pageIndex: number
}) {
  let { projectId } = useParams<{ projectId: string }>()
  const { data, loading, error } = useGetProjectQuery({
    variables: { projectId },
  })
  const [fieldName, setFieldName] = useState('')
  const [dataType, setDataType] = useState('String')
  const [createVariable] = useCreateAppVariableMutation({
    refetchQueries: [{ query: GetProjectDocument, variables: { projectId } }],
  })
  const [deleteVariable] = useDeleteAppVariableMutation({
    refetchQueries: [{ query: GetProjectDocument, variables: { projectId } }],
  })

  if (error) {
    return <div>Error</div>
  }
  if (loading) {
    return <div>Loading...</div>
  }
  if (!data) {
    return <div>no data</div>
  }
  if (selectedPage !== pageIndex) {
    return null
  }
  return (
    <div style={{ display: selectedPage === pageIndex ? 'initial' : 'none' }}>
      {data.getProject.appConfig.variables.map(variable => (
        <div key={variable._id}>
          {variable.name} - {variable.type}
          <IconButton
            onClick={() => {
              deleteVariable({
                variables: {
                  projectId,
                  variableId: variable._id,
                },
              })
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
      <div>Create variable</div>
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
            ...data.getProject.serverConfig.apiConfig.models.map(modelType => ({
              label: modelType.name,
              value: modelType._id,
            })),
          ]}
        />
        <button
          className="outlined-accent-button"
          onClick={async () => {
            await createVariable({
              variables: {
                projectId,
                name: fieldName,
                type: dataType,
              },
            })
            setFieldName('')
            setDataType('String')
          }}
        >
          New Field
        </button>
      </div>
    </div>
  )
}

function ServerConfiguration({
  selectedPage,
  pageIndex,
}: {
  selectedPage: number
  pageIndex: number
}) {
  if (selectedPage !== pageIndex) {
    return null
  }
  return (
    <div
      style={{ display: selectedPage === pageIndex ? 'initial' : 'none' }}
    ></div>
  )
}

function DatabaseConfiguration({
  isLocal,
  selectedPage,
  pageIndex,
}: {
  isLocal: boolean
  selectedPage: number
  pageIndex: number
}) {
  let { projectId } = useParams<{ projectId: string }>()
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const { data: liveServerStatusData } = useGetServerStatusQuery({
    variables: {
      projectId,
      sandbox: false,
    },
    pollInterval: 10000,
  })
  const { data: sandboxServerStatusData } = useGetServerStatusQuery({
    variables: {
      projectId,
      sandbox: true,
    },
  })
  const [newModelName, setNewModelName] = useState('')
  const { data, loading, error } = useGetProjectQuery({
    variables: { projectId },
  })
  const [createNewEntityModel] = useCreateEntityModelMutation({
    refetchQueries: [
      {
        query: GetProjectDocument,
        variables: { projectId },
      },
    ],
  })
  const handleAccordianChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }
  if (error) {
    return <div>Error</div>
  }
  if (loading) {
    return <div>Loading...</div>
  }
  if (!projectId) {
    return <div>missing project id</div>
  }
  if (selectedPage !== pageIndex) {
    return null
  }
  return (
    <div
      style={{
        overflow: 'hidden',
      }}
    >
      <div>
        {isLocal ? (
          <div />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto auto',
              justifyContent: 'end',
              gap: '0.5rem',
            }}
          >
            <StatusChip
              label="Sandbox"
              status={sandboxServerStatusData?.getServerStatus}
            />
            <StatusChip
              label="Live"
              status={liveServerStatusData?.getServerStatus}
            />
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '250px 1fr',
            gap: '1.5rem',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflow: 'auto' }}>
            {data?.getProject && (
              <div>
                {data.getProject.serverConfig.apiConfig.models
                  .filter(m => m.isLocal === isLocal)
                  .map(model => (
                    <Accordion
                      key={model._id}
                      expanded={expanded === model._id.toString()}
                      onChange={handleAccordianChange(model._id.toString())}
                      elevation={0}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          margin: '0.25rem',
                          background: '#F7F6F6',
                          color:
                            expanded === model._id.toString()
                              ? '#DD1C74'
                              : 'black',
                          borderStyle: 'dashed',
                          borderWidth: '1px',
                          borderColor:
                            expanded === model._id.toString()
                              ? '#F24726'
                              : 'black',
                          borderRadius: 5,
                        }}
                      >
                        {model.name}
                      </AccordionSummary>
                      <AccordionDetails>
                        <EntityModel
                          projectId={projectId!}
                          model={model}
                          models={data.getProject.serverConfig.apiConfig.models}
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))}
                <Accordion
                  expanded={expanded === 'new'}
                  onChange={handleAccordianChange('new')}
                  elevation={0}
                  sx={{
                    margin: '0.25rem',
                    background: '#F7F6F6',
                    color: '#DD1C74',
                    border: 'dashed 1px #F24726',
                    borderRadius: 5,
                  }}
                >
                  <AccordionSummary sx={{}}>
                    <div className="spaced-and-centered">
                      <span>Create New Data Collection</span>
                      <span style={{ color: 'black' }}>
                        <Add />
                      </span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <LabeledTextInput
                        label="Collection Name"
                        type="text"
                        value={newModelName}
                        onChange={e => {
                          const name = e.currentTarget.value
                          if (name === '' || variableNameRegex.test(name)) {
                            setNewModelName(name)
                          }
                        }}
                      />
                      <button
                        className="outlined-accent-button"
                        onClick={async () => {
                          await createNewEntityModel({
                            variables: {
                              name: newModelName,
                              isLocal,
                              projectId,
                            },
                          })
                          setNewModelName('')
                        }}
                      >
                        Create New Model
                      </button>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            )}
          </div>
          <div style={{ overflow: 'auto' }}>
            {data && (
              <DataEditor
                model={data.getProject.serverConfig.apiConfig.models.find(
                  model => model._id.toString() === expanded
                )}
                models={data.getProject.serverConfig.apiConfig.models}
                sandboxEndpoint={
                  data.getProject.serverConfig.apiConfig.sandboxEndpoint
                }
                liveEndpoint={
                  data.getProject.serverConfig.apiConfig.liveEndpoint
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Database: React.FC = function Database() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const navigate = useNavigate()

  return (
    <Modal open={true} onClose={() => navigate('../')} sx={{ padding: '5rem' }}>
      <Paper
        sx={{
          height: '100%',
          width: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          padding: '2em',
        }}
      >
        <TabWrapper>
          <MainTabHeader
            selected={selectedTabIndex === 0}
            onClick={() => setSelectedTabIndex(0)}
          >
            Server Database
          </MainTabHeader>
          <MainTabHeader
            selected={selectedTabIndex === 1}
            onClick={() => setSelectedTabIndex(1)}
          >
            App Variables
          </MainTabHeader>
          <MainTabHeader
            selected={selectedTabIndex === 2}
            onClick={() => setSelectedTabIndex(2)}
          >
            Local Database
          </MainTabHeader>
          <MainTabHeader
            selected={selectedTabIndex === 3}
            onClick={() => setSelectedTabIndex(3)}
          >
            Server Configuration
          </MainTabHeader>
        </TabWrapper>
        <DatabaseConfiguration
          isLocal={false}
          pageIndex={0}
          selectedPage={selectedTabIndex}
        />
        <VariableConfiguration pageIndex={1} selectedPage={selectedTabIndex} />
        <DatabaseConfiguration
          isLocal={true}
          pageIndex={2}
          selectedPage={selectedTabIndex}
        />
        <ServerConfiguration pageIndex={3} selectedPage={selectedTabIndex} />
      </Paper>
    </Modal>
  )
}

export default Database
