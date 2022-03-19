import { IconButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import LanIcon from '@mui/icons-material/Lan'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export type ComponentId = string
export type EntityId = string

interface Field {
  key: string
  dataType: string
  name: string
  hasSubMenu: boolean
}
export interface DataStructure {
  _id: string
  name: string
  fields: Field[]
}

export interface MenuStructure {
  source: ComponentId
  entity: EntityId
  label: string
  hasSubMenu: boolean
}

function SubMenu(props: {
  label: string
  entityId: string
  dataStructure: { [key: string]: DataStructure }
  onSelect: (entityPath: string, labelPath: string) => void
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
  function handleSubMenuSelect(entityPath: string, labelPath: string) {
    props.onSelect(entityPath, labelPath)
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
        {props.dataStructure[props.entityId].fields.map(element =>
          element.hasSubMenu ? (
            <SubMenu
              label={element.name}
              dataStructure={props.dataStructure}
              entityId={element.dataType}
              key={element.key}
              onSelect={(entityPath, labelPath) =>
                handleSubMenuSelect(
                  `${element.key}.${entityPath}`,
                  `${element.name}.${labelPath}`
                )
              }
            />
          ) : (
            <MenuItem
              key={element.key}
              onClick={() => handleSubMenuSelect(element.key, element.name)}
            >
              {element.name}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  )
}

interface DataBinderProps {
  entry: MenuStructure[]
  dataStructure: { [key: string]: DataStructure }
  onSelect: (entityPath: string, labelPath: string) => void
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
  const handleSelect = (entityPath: string, labelPath: string) => {
    props.onSelect(`${entityPath}`, `${labelPath}`)
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
        {props.entry.map(element =>
          element.hasSubMenu ? (
            <SubMenu
              label={element.label}
              entityId={element.entity}
              dataStructure={props.dataStructure}
              key={element.entity}
              onSelect={(entityPath, labelPath) =>
                handleSelect(
                  `${element.entity}.${entityPath}`,
                  `${element.label}.${labelPath}`
                )
              }
            />
          ) : (
            <MenuItem
              key={element.entity}
              onClick={() => handleSelect(element.entity, element.label)}
            >
              {element.label}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  )
}

export default DataBinder
