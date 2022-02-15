import React from 'react'
import { useNavigate } from 'react-router-dom'

const Database: React.FC = function Database() {
  const navigation = useNavigate()
  return (
    <div>
      <h1>Database</h1>
      <button onClick={() => navigation('/organizations')}>Organization</button>
    </div>
  )
}

export default Database
