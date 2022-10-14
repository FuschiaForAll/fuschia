import { gql } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import {Button} from "@mui/material"
import { Link } from 'react-router-dom'

import {
  useCreateProjectMutation,
  useListOrganizationsQuery,
  useListProjectsQuery,
  ListProjectsDocument,
  useDeleteProjectMutation,
} from '../../generated/graphql'

const Projects: React.FC = function Projects() {
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [projectName, setProjectName] = useState('')
  const { data: organizations } = useListOrganizationsQuery()
  const { data: projects } = useListProjectsQuery()

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
  const [deleteProjectMutation] = useDeleteProjectMutation({
    refetchQueries: [{ query: ListProjectsDocument }],
  })
  useEffect(() => {
    if (organizations && organizations.listOrganizations.length > 0) {
      setSelectedOrganization(organizations.listOrganizations[0]._id)
    }
  }, [organizations])

  return (
    <div style={{ margin: '10px', padding: '10px'}}>
      <h1>Projects</h1>
      <div style={{ margin: '5px', padding: '10px'}}>
        <span>Select an organization to create a project for</span>
        <div>
          <div style={{ marginLeft: '5px', padding: '10px', fontSize: '20px'}}>All Teams</div>
          {organizations?.listOrganizations.map(org => (
            <div 
             style={{ marginLeft: '20px', padding: '5px', fontSize: '14px'}}
            key={org._id}>{org.name}</div>
          ))}
        </div>
        <select
          style={{ margin: '20px', padding: '5px', fontSize: '18px', minWidth: '150px'}}
          value={selectedOrganization}
          onChange={e => {
            const newValue = e.target.value
            setSelectedOrganization(newValue)
          }}
        >
          {organizations?.listOrganizations.map(org => (
            <option value={org._id} key={org._id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ fontSize: '20px'}}>
        <label htmlFor="project-name">Project Name</label>
        <input
          style={{ margin: '10px', padding: '10px'}}
          name="project-name"
          type="text"
          value={projectName}
          onChange={e => {
            const newProjectName = e.currentTarget.value
            setProjectName(newProjectName)
          }}
        />
        <button
          style={{ fontSize: '20px', backgroundColor: 'fuchsia'}}
          onClick={async () => {
            await createProject({
              variables: {
                project: {
                  organizationId: selectedOrganization,
                  projectName,
                },
              },
            })
            setProjectName('')
          }}
        >
          Create Project
        </button>
        </div>
       {projects?.listProjects.map(project => (
       <div style={{ fontSize: '20px'}}>
       <Link key={project._id} to={`/projects/${project._id}/builder`}>
          {project.projectName}
        </Link>
       </div>
      ))}
    </div>
    
    
  )
}

export default Projects
