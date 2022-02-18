import React from 'react'
import IconButton from '@mui/material/IconButton'

interface ItemProps {
  onDrag?: React.MouseEventHandler<HTMLButtonElement>
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const buttonStyles = {
  margin: '0.5rem 0',
}

const Item: React.FC<ItemProps> = function Item({ children, onDrag, onClick }) {
  return (
    <IconButton
      color="primary"
      sx={buttonStyles}
      onMouseDown={onDrag}
      onClick={onClick}
    >
      {children}
    </IconButton>
  )
}

export default Item
