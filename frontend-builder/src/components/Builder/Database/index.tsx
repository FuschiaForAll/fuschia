import { Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

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

const Database: React.FC = function Database() {
  let { projectId } = useParams<{ projectId: string }>()
  const navigation = useNavigate()
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const { data: liveServerStatusData } = useGetServerStatusQuery({
    variables: {
      projectId,
      sandbox: false,
    },
  })
  const { data: sandboxServerStatusData } = useGetServerStatusQuery({
    variables: {
      projectId,
      sandbox: true,
    },
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
    <div>
      <h1>Database</h1>
      <button onClick={() => navigation('/organizations')}>Organization</button>
      {liveServerStatusData && (
        <div>
          Live Server Status -{' '}
          {liveServerStatusData.getServerStatus ? 'Online' : 'Offline'}
        </div>
      )}
      {sandboxServerStatusData && (
        <div>
          Sandbox Server Status -{' '}
          {sandboxServerStatusData?.getServerStatus ? 'Online' : 'Offline'}
        </div>
      )}
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab label="Database Editor" />
        <Tab label="Data Editor" />
        <Tab label="GraphQL Designer" />
        <Tab label="Auth" />
      </Tabs>
      <TabPanel value={selectedTab} index={0}>
        {data?.getProject && (
          <div>
            <h2>Models</h2>

            {data.getProject.appConfig.apiConfig.models.map(model => (
              <Accordion
                key={model._id}
                expanded={expanded === model._id.toString()}
                onChange={handleAccordianChange(model._id.toString())}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
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
                liveEndpoint={data.getProject.appConfig.apiConfig.liveEndpoint}
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
            liveEndpoint={data.getProject.appConfig.apiConfig.liveEndpoint}
          />
        )}
      </TabPanel>
      <TabPanel value={selectedTab} index={3}>
        {data && data.getProject.appConfig.authConfig && (
          <AuthConfig projectId={projectId} />
        )}
      </TabPanel>
    </div>
  )
}

export default Database
