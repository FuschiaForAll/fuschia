import { IconButton } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import LanIcon from '@mui/icons-material/Lan'
import { CascadingMenu } from '../../../Shared/CascadingMenu'

export type ComponentId = string
export type EntityId = string

export interface DataStructure {
  _id: string
  name: string
  fields: MenuStructure[]
}

export interface MenuStructure {
  type: 'LOCAL_DATA' | 'SERVER_DATA' | 'INPUT' | 'PRIMITIVE'
  source: ComponentId
  entity: EntityId
  label: string
  hasSubMenu: boolean
}

interface DataBinderProps {
  targetType?: string
  entry: MenuStructure[]
  dataStructure: { [key: string]: DataStructure }
  onSelect: (
    entityType: string,
    entityPath: string,
    labelPath: string,
    type: 'LOCAL_DATA' | 'SERVER_DATA' | 'INPUT' | 'PRIMITIVE'
  ) => void
}

const DataBinder: React.FC<DataBinderProps> = function DataBinder(
  props: DataBinderProps
) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    // @ts-ignore
    if (ref.current && event.target && !ref.current.contains(event.target)) {
      setOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(o => !o)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSelect = (
    entityType: string,
    entityPath: string,
    labelPath: string,
    type: 'LOCAL_DATA' | 'SERVER_DATA' | 'INPUT' | 'PRIMITIVE'
  ) => {
    props.onSelect(entityType, `${entityPath}`, `${labelPath}`, type)
    handleClose()
  }
  return (
    <div ref={ref}>
      <IconButton onClick={handleClick}>
        <LanIcon fontSize="small" />
      </IconButton>
      {open && (
        <div style={{ position: 'absolute' }}>
          <CascadingMenu
            menu={props.entry}
            dataStructure={props.dataStructure}
            onSelect={(entityType, value, label, type) =>
              handleSelect(entityType, value, label, type)
            }
          />
        </div>
      )}
    </div>
  )
}

export default DataBinder
