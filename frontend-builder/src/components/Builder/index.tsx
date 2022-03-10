import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Route, Routes, useParams } from 'react-router-dom'
import { useListProjectsQuery } from '../../generated/graphql'
import Settings from '../App/Settings'

import Canvas from './Canvas'
import Database from './Database'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import FullScreenLoader from '../Shared/FullScreenLoader'
import PropertyWindow from './Properties'
import Scalebar from './Scalebar'
import LabelLibrary from './LabelLibrary'

const GET_PROJECT = gql`
  query GetBuilderProject($projectId: ObjectId!) {
    project: getProject(projectId: $projectId) {
      _id
      appId
      projectName
      body
    }
  }
`

const Builder: React.FC = function Builder() {
  const { projectId } = useParams()

  const { data: projects } = useListProjectsQuery()
  const { data, loading } = useQuery(GET_PROJECT, { variables: { projectId } })

  const project = data?.project

  if (!data && loading) {
    return <FullScreenLoader />
  } else if (!data) {
    return (
      <div>
        <h1>Could not load project!</h1>
      </div>
    )
  }

  return (
    <>
      <div>
        <Canvas />
        <Topbar
          projects={projects?.listProjects}
          currentProject={projectId}
          projectName={project.projectName}
        />
        <Sidebar />
        <Scalebar />
        <PropertyWindow />
      </div>
      <Routes>
        <Route path="database" element={<Database />} />
        <Route path="app-settings" element={<Settings />} />
        <Route path="label-library" element={<LabelLibrary />} />
      </Routes>
    </>
  )
}

export default Builder
