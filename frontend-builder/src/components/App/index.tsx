import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login, Register } from '../Authentication'
import Builder from '../Builder'
import Database from '../Builder/Database'
import Projects from '../Projects'
import Organizations from '../Settings/Organizations'
import './App.css'

const App: React.FC = function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/builder" />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/builder/*" element={<Builder />} />
        <Route path="/database-editor" element={<Database />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
