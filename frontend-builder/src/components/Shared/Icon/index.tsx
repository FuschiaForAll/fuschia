import React from 'react'
import SvgIcon from '@mui/material/SvgIcon'

import databaseIcon from './icons/database.svg'

type IconType = 'database'

interface IconProps {
  icon: IconType
}

const icons: Record<IconType, SVGElement> = {
  database: databaseIcon as any as SVGElement,
}

const Icon: React.FC<IconProps> = function Icon({ icon }) {
  const svg = icons[icon]

  return <SvgIcon inheritViewBox component={svg} />
}

export default Icon
