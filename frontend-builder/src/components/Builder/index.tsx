import { useQuery, gql } from '@apollo/client'
import React from 'react'
import { useListProjectsQuery } from '../../generated/graphql'
import Canvas from './Canvas'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const Builder: React.FC = function Builder() {
  const { data: projects } = useListProjectsQuery()
  const { data: currentProjectData } = useQuery(gql`
    query CurrentProjectId {
      currentProjectId @client
    }
  `)
  return (
    <div>
      <Canvas />
      <Sidebar />
      <Topbar
        projects={projects?.listProjects}
        currentProject={currentProjectData.currentProjectId}
      />
    </div>
  )
}

export default Builder
