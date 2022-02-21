import { Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import {
  useCreateEntityModelMutation,
  useGetProjectQuery,
  useGetServerStatusQuery,
  usePublishApiMutation,
} from '../../../generated/graphql'
import { AuthConfig } from './AuthConfig'
import DataEditor from './DataEditor'
import { EntityModel } from './EntityModel'
import GraphQLDesigner from './GraphQLDesigner'
import { GetProjectDocument } from '../../../generated/graphql'
import { AccordionDetails, AccordionSummary, Box } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import Modal from '@mui/material/Modal'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:before': {
    display: 'none',
  },
}))

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <span>{children}</span>
        </div>
      )}
    </div>
  )
}

function StatusChip({ label, status }: { label: string; status?: boolean }) {
  return (
    <Box
      sx={{
        color: status ? 'success.main' : 'error.main',
        borderColor: status ? 'success.main' : 'error.main',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        width: 125,
        padding: '0.5rem',
      }}
    >
      {label}
    </Box>
  )
}

const Database: React.FC = function Database() {
  let { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
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
    pollInterval: 10000,
  })
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [newModelName, setNewModelName] = useState('')
  const { data, loading, error } = useGetProjectQuery({
    variables: { projectId },
  })
  const [publishApi] = usePublishApiMutation()
  const [createNewEntityModel] = useCreateEntityModelMutation({
    refetchQueries: [
      {
        query: GetProjectDocument,
        variables: { projectId },
      },
    ],
  })
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
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
  return (
    <Modal open={true} onClose={() => navigate('../')} sx={{ padding: '5rem' }}>
      <Paper
        sx={{
          height: '100%',
          width: '100%',
          padding: '1rem',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            justifyContent: 'space-between',
          }}
        >
          <Typography>Database Collections</Typography>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
            <StatusChip
              label="Sandbox"
              status={sandboxServerStatusData?.getServerStatus}
            />
            <StatusChip
              label="Live"
              status={liveServerStatusData?.getServerStatus}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr' }}>
          <div>
            {data?.getProject && (
              <div>
                {data.getProject.appConfig.apiConfig.models.map(model => (
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
                        color: '#DD1C74',
                        border: 'dashed 1px black',
                        borderRadius: 5,
                      }}
                    >
                      {model.name}
                    </AccordionSummary>
                    <AccordionDetails>
                      <EntityModel
                        projectId={projectId!}
                        model={model}
                        models={data.getProject.appConfig.apiConfig.models}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))}
                <input
                  type="text"
                  value={newModelName}
                  onChange={e => {
                    const name = e.currentTarget.value
                    setNewModelName(name)
                  }}
                />
                <button
                  onClick={async () => {
                    await createNewEntityModel({
                      variables: {
                        name: newModelName,
                        projectId,
                      },
                    })
                    setNewModelName('')
                  }}
                >
                  Create New Model
                </button>
                <button
                  onClick={() =>
                    publishApi({
                      variables: {
                        projectId,
                        sandbox: true,
                      },
                    })
                  }
                >
                  Publish Sandbox
                </button>
                <button
                  onClick={() =>
                    publishApi({
                      variables: {
                        projectId,
                        sandbox: false,
                      },
                    })
                  }
                >
                  Publish Live
                </button>
              </div>
            )}
          </div>
          <div>
            <Tabs value={selectedTab} onChange={handleChange}>
              <Tab label="Database Editor" />
              <Tab label="Data Editor" />
              <Tab label="GraphQL Designer" />
              <Tab label="Auth" />
            </Tabs>
            <TabPanel value={selectedTab} index={0}>
              <div />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              {data &&
                data.getProject.appConfig.apiConfig.models.map(model => (
                  <div key={model._id}>
                    <DataEditor
                      model={model}
                      models={data.getProject.appConfig.apiConfig.models}
                      sandboxEndpoint={
                        data.getProject.appConfig.apiConfig.sandboxEndpoint
                      }
                      liveEndpoint={
                        data.getProject.appConfig.apiConfig.liveEndpoint
                      }
                    />
                  </div>
                ))}
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              {data && (
                <GraphQLDesigner
                  sandboxEndpoint={
                    data.getProject.appConfig.apiConfig.sandboxEndpoint
                  }
                  liveEndpoint={
                    data.getProject.appConfig.apiConfig.liveEndpoint
                  }
                />
              )}
            </TabPanel>
            <TabPanel value={selectedTab} index={3}>
              {data && data.getProject.appConfig.authConfig && (
                <AuthConfig projectId={projectId} />
              )}
            </TabPanel>
          </div>
        </div>
      </Paper>
    </Modal>
  )
}

export default Database
