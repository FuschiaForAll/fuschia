import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Builder from '../Builder'
import './App.css'

const App: React.FC = function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
