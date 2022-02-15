import React from 'react'
import Canvas from './Canvas'
import Sidebar from './Sidebar'

const Builder: React.FC = function Builder() {
  return (
    <div>
      <Canvas />
      <Sidebar />
    </div>
  )
}

export default Builder
