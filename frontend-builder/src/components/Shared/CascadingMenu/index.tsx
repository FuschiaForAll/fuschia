import React from 'react'
import styled from '@emotion/styled'

export const NavMenu = styled.ul`
  list-style-type: none;
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
  margin-bottom: auto !important;

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
    left: 100%;
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
  type:
    | 'LOCAL_DATA'
    | 'SERVER_DATA'
    | 'INPUT'
    | 'PRIMITIVE'
    | 'ASSET'
    | 'VARIABLE'
}

type RootMenu = MenuStructure[]

export function CascadingMenu({
  menu,
  dataStructure,
  onSelect,
}: {
  dataStructure: { [key: string]: DataStructure }
  menu: RootMenu
  onSelect: (
    entityId: string,
    value: string,
    label: string,
    type:
      | 'LOCAL_DATA'
      | 'SERVER_DATA'
      | 'INPUT'
      | 'PRIMITIVE'
      | 'ASSET'
      | 'VARIABLE'
  ) => void
}) {
  return (
    <NavMenu>
      {menu.map(element => (
        <li
          key={element.source}
          onClick={e => {
            e.stopPropagation()
            onSelect(
              element.entity,
              element.source,
              element.label,
              element.type
            )
          }}
        >
          <div
            style={{
              display: 'grid',
              gridAutoFlow: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span>{element.label}</span>
            <span>{element.hasSubMenu ? '>' : ''}</span>
          </div>
          {dataStructure[element.entity] && (
            <CascadingMenu
              menu={dataStructure[element.entity].fields}
              dataStructure={dataStructure}
              onSelect={(entity, value, label) =>
                onSelect(
                  entity,
                  `${element.source}.${value}`,
                  `${element.label}.${label}`,
                  element.type
                )
              }
            />
          )}
        </li>
      ))}
    </NavMenu>
  )
}
