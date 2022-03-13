import { IconButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import LanIcon from '@mui/icons-material/Lan'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

interface MenuStructure {
  key: string
  subMenu?: Array<MenuStructure>
}

const PlacesMenu: MenuStructure = {
  key: 'Places',
  subMenu: [{ key: 'User' }],
}

const UserMenu: MenuStructure = {
  key: 'User',
  subMenu: [PlacesMenu],
}

const mockDataStructure: MenuStructure[] = [UserMenu, PlacesMenu]

function SubMenu(props: { label: string; menuItems: any[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function handleItemClick(event: React.MouseEvent<HTMLLIElement>) {
    if (!anchorEl) {
      setAnchorEl(event.currentTarget)
    }
  }

  function handleSubMenuClose() {
    setAnchorEl(null)
  }
  return (
    <>
      <MenuItem
        key={props.label}
        onMouseOver={e => setAnchorEl(e.currentTarget)}
      >
        <ListItemText>{props.label}</ListItemText>
        <ListItemIcon>
          <ArrowForwardIosIcon fontSize="small" />
        </ListItemIcon>
      </MenuItem>
      <Menu
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleSubMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {props.menuItems.map(element =>
          element.subMenu ? (
            <SubMenu
              label={element.key}
              menuItems={element.subMenu}
              key={element.key}
            />
          ) : (
            <MenuItem key={element.key} onClick={handleSubMenuClose}>
              {element.key}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  )
}

const DataBinder: React.FC = function DataBinder() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <IconButton onClick={handleClick}>
        <LanIcon fontSize="small" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {mockDataStructure.map(element =>
          element.subMenu ? (
            <SubMenu
              label={element.key}
              menuItems={element.subMenu}
              key={element.key}
            />
          ) : (
            <MenuItem key={element.key} onClick={handleClose}>
              {element.key}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  )
}

export default DataBinder
