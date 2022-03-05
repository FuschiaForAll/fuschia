import React from 'react'
import IconButton from '@mui/material/IconButton'
import { Tooltip } from '@mui/material'
interface ItemProps {
  title: string
  onDrag?: React.MouseEventHandler<HTMLButtonElement>
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const buttonStyles = {
  margin: '0.5rem 0',
}

const Item: React.FC<ItemProps> = function Item({
  children,
  title,
  onDrag,
  onClick,
}) {
  return (
    <Tooltip title={title}>
      <IconButton
        color="primary"
        sx={buttonStyles}
        onMouseDown={onDrag}
        onClick={onClick}
      >
        {children}
      </IconButton>
    </Tooltip>
  )
}

export default Item
