import React from 'react'
import { createPortal } from 'react-dom'
import usePortal from '../../../utils/hooks/usePortal'

const Portal: React.FC<{ id: string }> = function Portal({ id, children }) {
  const target = usePortal(id)
  return createPortal(children, target)
}

export default Portal
