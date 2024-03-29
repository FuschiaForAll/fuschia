import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useGetPackagesQuery } from '../../generated/graphql'
import { Login, Register } from '../Authentication'
import Builder from '../Builder'
import Dashboard from '../Dashboard'
import Projects from '../Projects'
import NewProject from '../Projects/NewProject'
import Organizations from '../Settings/Organizations'
import './App.css'
import { PrivateRoute } from './PrivateRoute'
import Datatable from '../Dashboard/datatable'

const App: React.FC = function App() {
  const [loaded, setLoaded] = useState(false)
  const { data: packageData } = useGetPackagesQuery({
    context: {
      clientName: 'package-manager',
    },
  })
  useEffect(() => {
    if (packageData) {
      try {
        // eslint-disable-next-line no-eval
        packageData.getPackages.forEach(_package => eval(_package.bundle))
      } catch (e) {
        console.error(e)
      }
      setLoaded(true)
    }
  }, [packageData])
  if (!loaded) {
    return <div>Loading Packages</div>
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/new" element={<NewProject />} />
          <Route path="/projects/:projectId/builder/*" element={<Builder />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/dashboard/datatable" element={<Datatable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
