import { IconButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import LanIcon from '@mui/icons-material/Lan'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export type ComponentId = string
export type EntityId = string

export interface DataStructure {
  _id: string
  name: string
  fields: MenuStructure[]
}

export interface MenuStructure {
  source: ComponentId
  entity: EntityId
  label: string
  hasSubMenu: boolean
}

function SubMenu(props: {
  targetType?: string
  label: string
  entityId: string
  dataStructure: { [key: string]: DataStructure }
  onSelect: (entityPath: string, labelPath: string) => void
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

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
        style={{
          color:
            props.targetType === props.entityId
              ? 'var(--accent)'
              : 'var(--black)',
        }}
        onClick={() => {
          if (props.targetType === props.entityId || !props.targetType) {
            handleSubMenuSelect(props.entityId, props.label)
          }
        }}
      >
        <ListItemText>{props.label}</ListItemText>
        <ListItemIcon onMouseOver={e => setAnchorEl(e.currentTarget)}>
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
              targetType={props.targetType}
              label={element.label}
              dataStructure={props.dataStructure}
              entityId={element.entity}
              key={element.source}
              onSelect={(entityPath, labelPath) =>
                handleSubMenuSelect(
                  `${element.source}.${entityPath}`,
                  `${element.label}.${labelPath}`
                )
              }
            />
          ) : (
            <MenuItem
              key={element.source}
              onClick={() => {
                if (props.targetType === props.entityId || !props.targetType) {
                  handleSubMenuSelect(element.source, element.label)
                }
              }}
            >
              {element.label}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  )
}

interface DataBinderProps {
  targetType?: string
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
              targetType={props.targetType}
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
