import React from 'react'
import { useListProjectsQuery } from '../../generated/graphql'
import NoProjects from './containers/NoProjects'

const Dashboard: React.FC = function Dashboard() {
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
  } = useListProjectsQuery()
  if (projectsError) {
    return <div>There was an error loading projects</div>
  }
  if (projectsLoading) {
    return <div>Loading...</div>
  }
  if (projectsData?.listProjects.length === 0) {
    return <NoProjects />
  }
  return <div></div>
}

export default Dashboard
