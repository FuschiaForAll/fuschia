import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import SearchIcon from '@mui/icons-material/Search'
import {
  useChangePasswordMutation,
  useCreateProjectMutation,
  useListOrganizationsQuery,
  useListProjectsQuery,
  useMeQuery,
  useUpdateMeMutation,
} from '../../generated/graphql'
import ViewListIcon from '@mui/icons-material/ViewList'
import ListIcon from '@mui/icons-material/List'
import SortIcon from '@mui/icons-material/Sort'
import { IconButton } from '@mui/material'
import { LabeledTextInput } from '../Shared/primitives/LabeledTextInput'
import { useNavigate } from 'react-router-dom'
import { gql } from '@apollo/client'
import { Button } from '../Shared/primitives/Button'
import { useAuth } from '../../utils/hooks/useAuth'
import { Logout } from '@mui/icons-material'
import { MainTabHeader, TabHeader, TabWrapper } from '../Shared/Tabs'

const DashboardWrapper = styled.div`
  padding: 2em;
`

const SearchBar = styled.div`
  margin-bottom: 1em;
  margin-top: 1em;
`
const ViewSelectionWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
`

const ProfileWrapper = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  margin-top: 3em;
`

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 350px;
  margin-bottom: 1em;
`

const ProjectView = styled.div`
  height: 250px;
  width: 350px;
  border-radius: 1em;
  padding: 1em;
  border: solid 1px var(--black);
  cursor: pointer;
  &:hover {
    border: solid 1px var(--accent);
  }
`
const ProjectsWrapper = styled.div`
  display: flex;
  gap: 1em;
`

function Teams({
  selectedPage,
  pageIndex,
}: {
  selectedPage: number
  pageIndex: number
}) {
  return (
    <div style={{ display: selectedPage === pageIndex ? 'initial' : 'none' }}>
      Teams
    </div>
  )
}

function Profile({
  selectedPage,
  pageIndex,
}: {
  selectedPage: number
  pageIndex: number
}) {
  const { data: meData } = useMeQuery()
  const [updateMe] = useUpdateMeMutation()
  const [changePassword] = useChangePasswordMutation()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [me, setMe] = useState({
    email: '',
    name: '',
  })
  useEffect(() => {
    if (meData) {
      setMe({
        email: meData.me?.email || '',
        name: meData.me?.fullName || '',
      })
    }
  }, [meData])
  return (
    <div style={{ display: selectedPage === pageIndex ? 'initial' : 'none' }}>
      <ProfileWrapper>
        <div>AVATAR</div>
        <div>
          <SettingsWrapper>
            <LabeledTextInput
              label="Name"
              value={me.name}
              onChange={e => {
                const val = e.target.value
                setMe(m => ({
                  ...m,
                  name: val,
                }))
              }}
            />
            <LabeledTextInput
              label="Email Address"
              value={me.email}
              onChange={e => {
                const val = e.target.value
                setMe(m => ({
                  ...m,
                  email: val,
                }))
              }}
            />
            <Button
              style={{ width: '200px' }}
              disabled={
                me.email === (meData?.me?.email || '') &&
                me.name === (meData?.me?.fullName || '')
              }
              onClick={() => {
                updateMe({
                  variables: {
                    userInput: {
                      email: me.email,
                      fullName: me.name,
                    },
                  },
                })
              }}
            >
              Update
            </Button>
          </SettingsWrapper>
          <SettingsWrapper>
            <LabeledTextInput
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={e => {
                const val = e.target.value
                setOldPassword(val)
              }}
            />
            <LabeledTextInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => {
                const val = e.target.value
                setNewPassword(val)
              }}
            />
            <Button
              style={{ width: '200px' }}
              disabled={!newPassword || !oldPassword}
              onClick={async () => {
                try {
                  const passwordChange = await changePassword({
                    variables: {
                      newPassword,
                      oldPassword,
                    },
                  })
                  if (passwordChange) {
                    setNewPassword('')
                    setOldPassword('')
                  }
                } catch {
                  // error
                }
              }}
            >
              Change Password
            </Button>
          </SettingsWrapper>
        </div>
      </ProfileWrapper>
    </div>
  )
}

function Account({
  selectedPage,
  pageIndex,
}: {
  selectedPage: number
  pageIndex: number
}) {
  const [selectedTab, setSelectedTab] = useState(0)
  return (
    <div style={{ display: selectedPage === pageIndex ? 'initial' : 'none' }}>
      <TabWrapper>
        <div>Overview</div>
        <TabHeader
          selected={selectedTab === 0}
          onClick={() => setSelectedTab(0)}
        >
          Profile
        </TabHeader>
        <TabHeader
          selected={selectedTab === 1}
          onClick={() => setSelectedTab(1)}
        >
          Teams
        </TabHeader>
        <TabHeader
          selected={selectedTab === 2}
          onClick={() => setSelectedTab(2)}
        >
          Settings
        </TabHeader>
        <TabHeader
          selected={selectedTab === 3}
          onClick={() => setSelectedTab(3)}
        >
          Billing
        </TabHeader>
      </TabWrapper>
      <Profile pageIndex={0} selectedPage={selectedTab} />
      <Teams pageIndex={1} selectedPage={selectedTab} />
    </div>
  )
}

function Projects({
  selectedPage,
  pageIndex,
}: {
  selectedPage: number
  pageIndex: number
}) {
  const [selectedTab, setSelectedTab] = useState(0)
  const [newProjectSelected, setNewProjectSelected] = useState(false)
  const [projectName, setProjectName] = useState('')

  const [createProject] = useCreateProjectMutation({
    update(cache, { data }) {
      cache.modify({
        fields: {
          listProjects(existingProjects = []) {
            const newProjectRef = cache.writeFragment({
              data: data?.createProject,
              fragment: gql`
                fragment NewProject on Project {
                  _id
                  projectName
                  appId
                }
              `,
            })
            return [...existingProjects, newProjectRef]
          },
        },
      })
    },
  })

  const navigate = useNavigate()
  const { data: organizationsData } = useListOrganizationsQuery()
  const { data: projectsData } = useListProjectsQuery()
  return (
    <div style={{ display: selectedPage === pageIndex ? 'initial' : 'none' }}>
      <TabWrapper>
        <div>All Teams</div>
        {organizationsData?.listOrganizations.map((org, index) => (
          <TabHeader
            key={index}
            selected={selectedTab === index}
            onClick={() => setSelectedTab(index)}
          >
            {org.name}
          </TabHeader>
        ))}
      </TabWrapper>
      <ViewSelectionWrapper>
        <div>
          <IconButton>
            <ViewListIcon />
          </IconButton>
          <IconButton>
            <ListIcon />
          </IconButton>
        </div>
        <IconButton>
          <SortIcon />
        </IconButton>
      </ViewSelectionWrapper>
      <ProjectsWrapper>
        {newProjectSelected ? (
          <div>
            <LabeledTextInput
              label="Project Name"
              value={projectName}
              onChange={e => {
                const newProjectName = e.currentTarget.value
                setProjectName(newProjectName)
              }}
            />
            <button
              onClick={async () => {
                await createProject({
                  variables: {
                    project: {
                      organizationId:
                        organizationsData!.listOrganizations[selectedTab]._id,
                      projectName,
                    },
                  },
                })
                setProjectName('')
                setNewProjectSelected(false)
              }}
            >
              Create Project
            </button>
            <button
              onClick={() => {
                setProjectName('')
                setNewProjectSelected(false)
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <ProjectView onClick={() => setNewProjectSelected(true)}>
              Create New Project
            </ProjectView>
            {projectsData?.listProjects.map(project => (
              <ProjectView
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}/builder`)}
              >
                {project.projectName}
              </ProjectView>
            ))}
          </>
        )}
      </ProjectsWrapper>
    </div>
  )
}

const Dashboard: React.FC = function Dashboard() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const { logout } = useAuth()
  return (
    <DashboardWrapper>
      <div
        style={{
          display: 'grid',
          justifyContent: 'space-between',
          gridAutoFlow: 'column',
        }}
      >
        <TabWrapper>
          <MainTabHeader
            selected={selectedTabIndex === 0}
            onClick={() => setSelectedTabIndex(0)}
          >
            Projects
          </MainTabHeader>
          <MainTabHeader
            selected={selectedTabIndex === 1}
            onClick={() => setSelectedTabIndex(1)}
          >
            Account
          </MainTabHeader>
          <MainTabHeader
            selected={selectedTabIndex === 2}
            onClick={() => setSelectedTabIndex(2)}
          >
            Hub
          </MainTabHeader>
        </TabWrapper>
        <IconButton onClick={logout}>
          <Logout />
        </IconButton>
      </div>
      <SearchBar>
        <SearchIcon />
      </SearchBar>
      <Projects pageIndex={0} selectedPage={selectedTabIndex} />
      <Account pageIndex={1} selectedPage={selectedTabIndex} />
    </DashboardWrapper>
  )
}

export default Dashboard
