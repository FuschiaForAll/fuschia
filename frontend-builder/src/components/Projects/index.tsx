import { gql } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  useCreateProjectMutation,
  useListOrganizationsQuery,
  useListProjectsQuery,
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

  useEffect(() => {
    if (organizations && organizations.listOrganizations.length > 0) {
      setSelectedOrganization(organizations.listOrganizations[0]._id)
    }
  }, [organizations])

  return (
    <div>
      <h1>Projects</h1>
      <div>
        <span>Select an organization to create a project for</span>
        <select
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
      <div>
        <label htmlFor="project-name">Project Name</label>
        <input
          name="project-name"
          type="text"
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
        <Link key={project._id} to={`/projects/${project._id}/builder`}>
          {project.projectName}
        </Link>
      ))}
    </div>
  )
}

export default Projects
