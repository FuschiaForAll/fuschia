import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Builder from '../Builder'
import './App.css'

const App: React.FC = function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/builder" />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/builder/*" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
