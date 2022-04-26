import React from 'react'
import Box from '@mui/material/Box'
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
const TabPanel: React.FC<TabPanelProps> = function TabPanel(
  props: TabPanelProps
) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  )
}

export default TabPanel
