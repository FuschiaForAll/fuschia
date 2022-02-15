import React from 'react'
import SvgIcon from '@mui/material/SvgIcon'

import databaseIcon from './icons/database.svg'
import analyticsIcon from './icons/analytics.svg'
import stylesIcon from './icons/styles.svg'
import shapesIcon from './icons/shapes.svg'
import expandRightIcon from './icons/expand-right.svg'
import inputIcon from './icons/input.svg'

type IconType =
  | 'database'
  | 'analytics'
  | 'styles'
  | 'shapes'
  | 'expandRight'
  | 'input'

interface IconProps {
  icon: IconType
}

const icons: Record<IconType, React.ComponentType> = {
  database: databaseIcon as any as React.ComponentType,
  analytics: analyticsIcon as any as React.ComponentType,
  styles: stylesIcon as any as React.ComponentType,
  shapes: shapesIcon as any as React.ComponentType,
  expandRight: expandRightIcon as any as React.ComponentType,
  input: inputIcon as any as React.ComponentType,
}

const Icon: React.FC<IconProps> = function Icon({ icon }) {
  const Svg = icons[icon]

  return <SvgIcon inheritViewBox component={Svg} />
}

export default Icon
