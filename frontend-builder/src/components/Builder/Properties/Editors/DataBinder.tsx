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
  subMenu: [
    {
      key: 'Building Name',
    },
    {
      key: 'Owner',
      subMenu: [
        {
          key: 'Email',
        },
        {
          key: 'First Name',
        },
        { key: 'Last Name' },
      ],
    },
  ],
}

const UserMenu: MenuStructure = {
  key: 'Me',
  subMenu: [
    {
      key: 'Email',
    },
    {
      key: 'First Name',
    },
    { key: 'Last Name' },
    PlacesMenu,
  ],
}

const mockDataStructure: MenuStructure[] = [UserMenu, PlacesMenu]

function SubMenu(props: {
  label: string
  menuItems: any[]
  onSelect: (selectedItem: string) => void
}) {
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
  function handleSubMenuSelect(e: string) {
    props.onSelect(e)
    handleSubMenuClose()
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
              onSelect={e => handleSubMenuSelect(`${element.key}.${e}`)}
            />
          ) : (
            <MenuItem
              key={element.key}
              onClick={() => handleSubMenuSelect(element.key)}
            >
              {element.key}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  )
}

interface DataBinderProps {
  onSelect: (selectedItem: string) => void
}

const DataBinder: React.FC<DataBinderProps> = function DataBinder(
  props: DataBinderProps
) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleSelect = (e: string) => {
    props.onSelect(`${e}`)
    handleClose()
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
              onSelect={e => handleSelect(`${element.key}.${e}`)}
            />
          ) : (
            <MenuItem
              key={element.key}
              onClick={() => handleSelect(element.key)}
            >
              {element.key}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  )
}

export default DataBinder
