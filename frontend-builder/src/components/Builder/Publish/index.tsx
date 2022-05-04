import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import { Paper, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { usePublishApiMutation } from '../../../generated/graphql'
import { LabeledTextInput } from '../../Shared/primitives/LabeledTextInput'

const Publish = function Publish() {
  const navigate = useNavigate()
  const [publishApi] = usePublishApiMutation()
  const [version, setVersion] = useState('')
  let { projectId } = useParams<{ projectId: string }>()

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
        <div>
          <LabeledTextInput
            title="New Version number"
            fontSize="1rem"
            label="New Version number"
            type="text"
            defaultValue={version}
            onBlur={e => {
              const v = e.currentTarget.value
              setVersion(v)
            }}
          />

          <button
            onClick={() => {
              publishApi({
                variables: {
                  projectId,
                  sandbox: false,
                  version,
                },
              })
            }}
          >
            Publish
          </button>
        </div>
      </Paper>
    </Modal>
  )
}

export default Publish
