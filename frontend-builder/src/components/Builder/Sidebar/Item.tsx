import React from 'react'
import IconButton from '@mui/material/IconButton'
import { Tooltip } from '@mui/material'
interface ItemProps {
  title: string
  margin?: string
  onDrag?: React.MouseEventHandler<HTMLButtonElement>
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const Item: React.FC<ItemProps> = function Item({
  children,
  title,
  onDrag,
  onClick,
}) {
  return (
    <Tooltip title={title}>
      <IconButton color="primary" onMouseDown={onDrag} onClick={onClick}>
        {children}
      </IconButton>
    </Tooltip>
  )
}

export default Item
