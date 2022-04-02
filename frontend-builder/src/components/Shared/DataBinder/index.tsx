import { IconButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import LanIcon from '@mui/icons-material/Lan'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import styled from '@emotion/styled'

const NavMenu = styled.ul`
  list-style-type: none;
  position: absolute;
  border-radius: 0.5rem;
  z-index: 500;
  user-select: none;
  padding-top: 8px;
  padding-bottom: 8px;
  // from paper
  opacity: 1;
  transform: none;
  transition: opacity 207ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    transform 138ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transform-origin: 0px 0px;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
  border-radius: 4px;
  box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
    0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
  position: absolute;
  outline: 0;

  li {
    position: relative;
    cursor: pointer;
  }
  li:hover > div:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  div {
    text-decoration: none;
    display: block;
    width: 125px;
    line-height: 1.5;
    padding-top: 6px;
    padding-bottom: 6px;
    box-sizing: border-box;
    white-space: nowrap;
    padding-left: 16px;
    padding-right: 16px;
  }
  li > ul {
    display: none;
    position: absolute;
    top: 0px;
    left: 125px;
  }
  li:hover > ul {
    display: block;
  }
`

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
