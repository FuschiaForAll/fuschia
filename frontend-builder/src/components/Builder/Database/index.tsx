import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useCreateEntityModelMutation,
  useGetProjectLazyQuery,
  useListProjectsQuery,
} from '../../../generated/graphql'
import { EntityModel } from './EntityModel'

const Database: React.FC = function Database() {
  const navigation = useNavigate()
  const [newModelName, setNewModelName] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >()
  const [getProject, { data, loading, error }] = useGetProjectLazyQuery()
  const { data: projects } = useListProjectsQuery()
  const [createNewEntityModel] = useCreateEntityModelMutation()
  useEffect(() => {
    if (projects && projects.listProjects.length > 0) {
      setSelectedProjectId(projects.listProjects[0]._id)
    }
  }, [projects])
  if (error) {
    return <div>Error</div>
  }
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h1>Database</h1>
      <button onClick={() => navigation('/organizations')}>Organization</button>
      <select
        value={selectedProjectId}
        onChange={e => {
          const newProject = e.target.value
          setSelectedProjectId(newProject)
        }}
      >
        {projects?.listProjects.map(project => (
          <option key={project._id} value={project._id}>
            {project.projectName}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          getProject({
            variables: {
              projectId: selectedProjectId,
            },
          })
        }}
      >
        Load Project
      </button>
      {data?.getProject && (
        <div>
          <h2>Models</h2>
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
                  projectId: selectedProjectId,
                },
              })
              setNewModelName('')
            }}
          >
            Create New Model
          </button>
          {selectedProjectId &&
            data.getProject.appConfig.apiConfig.models.map(model => (
              <EntityModel
                projectId={selectedProjectId}
                key={model._id}
                model={model}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default Database
