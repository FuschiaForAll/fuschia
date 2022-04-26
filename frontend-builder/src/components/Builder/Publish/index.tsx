import React from 'react'
import Modal from '@mui/material/Modal'
import { Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Publish = function Publish() {
  const navigate = useNavigate()

  return (
    <Modal open={true} onClose={() => navigate('../')} sx={{ padding: '5rem' }}>
      <Paper
        sx={{
          height: '100%',
          width: '100%',
          padding: '1rem',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            justifyContent: 'space-between',
          }}
        >
          <Typography>Publish</Typography>
        </div>
      </Paper>
    </Modal>
  )
}

export default Publish
