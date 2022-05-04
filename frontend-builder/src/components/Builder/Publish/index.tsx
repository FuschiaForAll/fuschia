import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import { Paper, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useGetDockerhubVersionsQuery,
  useGetProjectQuery,
  useLaunchInstanceMutation,
  usePublishApiMutation,
  useUpdateServerVersionMutation,
} from '../../../generated/graphql'
import { LabeledTextInput } from '../../Shared/primitives/LabeledTextInput'

function CreateServerInstance({ projectId }: { projectId: string }) {
  const [launchInstance] = useLaunchInstanceMutation()
  const [instanceType, setInstanceType] = useState('t2.nano')
  const [availabilityZone, setAvailabilityZone] = useState('ca-central-1a')
  return (
    <div>
      <div>You have not launched your server yet. Launch now?</div>
      <div>
        <LabeledTextInput
          title="Instance Type"
          fontSize="1rem"
          label="Instance Type"
          type="text"
          defaultValue={instanceType}
          onBlur={e => {
            const v = e.currentTarget.value
            setInstanceType(v)
          }}
        />
      </div>
      <div>
        <LabeledTextInput
          title="Availability Zone"
          fontSize="1rem"
          label="Availability Zone"
          type="text"
          defaultValue={availabilityZone}
          onBlur={e => {
            const v = e.currentTarget.value
            setAvailabilityZone(v)
          }}
        />
      </div>
      <div>
        <button
          onClick={() => {
            launchInstance({
              variables: {
                projectId,
                availabilityZone,
                instanceType,
              },
            })
          }}
        >
          LAUNCH
        </button>
      </div>
    </div>
  )
}

function UpdateServerInstance({
  projectId,
  ec2url,
}: {
  projectId: string
  ec2url?: string | null
}) {
  const [version, setVersion] = useState('')
  const [publishApi] = usePublishApiMutation()
  const [updateServerVersion] = useUpdateServerVersionMutation()
  const { data: versionData } = useGetDockerhubVersionsQuery({
    variables: {
      projectId,
    },
  })
  return (
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
      <div>Server DNS: {ec2url}</div>
      <div>
        Sandbox Graphl:{' '}
        <a
          href={`http://${ec2url}:4000/graphql`}
        >{`http://${ec2url}:4000/graphql`}</a>
      </div>
      <div>
        Production Graphl:{' '}
        <a
          href={`http://${ec2url}:5000/graphql`}
        >{`http://${ec2url}:5000/graphql`}</a>
      </div>
      <div>
        {versionData?.getDockerhubVersions
          .slice()
          .sort((a, b) => a.localeCompare(b))
          .map((v, index) => (
            <div key={index}>
              <span>{v}</span>
              <button
                onClick={() => {
                  updateServerVersion({
                    variables: {
                      projectId,
                      sandbox: true,
                      version: v.split('-')[0],
                    },
                  })
                }}
              >
                Deploy on Test Server
              </button>
              <button onClick={() => {}}>Deploy on Live Server</button>
            </div>
          ))}
      </div>
    </div>
  )
}

const Publish = function Publish() {
  const navigate = useNavigate()
  let { projectId } = useParams<{ projectId: string }>()
  const { data } = useGetProjectQuery({
    variables: {
      projectId,
    },
  })
  if (!data) {
    return null
  }
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
        {data.getProject.serverConfig.ec2InstanceId ? (
          <UpdateServerInstance
            projectId={projectId!}
            ec2url={data.getProject.serverConfig.ec2PublicDns}
          />
        ) : (
          <CreateServerInstance projectId={projectId!} />
        )}
      </Paper>
    </Modal>
  )
}

export default Publish
