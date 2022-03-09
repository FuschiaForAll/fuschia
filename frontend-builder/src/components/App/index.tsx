import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useGetPackagesQuery } from '../../generated/graphql-packages'
import { Login, Register } from '../Authentication'
import Builder from '../Builder'
import Dashboard from '../Dashboard'
import Projects from '../Projects'
import NewProject from '../Projects/NewProject'
import Organizations from '../Settings/Organizations'
import './App.css'
const App: React.FC = function App() {
  const [loaded, setLoaded] = useState(false)
  const { data: packageData } = useGetPackagesQuery({
    context: {
      clientName: 'package-manager',
    },
  })
  useEffect(() => {
    if (packageData) {
      // eslint-disable-next-line no-eval
      packageData.getPackages.forEach(_package => eval(_package.bundle))
      setLoaded(true)
    }
  }, [packageData])
  if (!loaded) {
    return <div>Loading</div>
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/projects" />} />
        <Route path="/project/new" element={<NewProject />} />
        <Route path="/projects/:projectId/builder/*" element={<Builder />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
