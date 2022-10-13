import { gql } from '@apollo/client'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useListOrganizationsQuery,
} from '../../../generated/graphql'

const Organizations: React.FC = function Organizations() {
  const navigate = useNavigate()
  const {
    data: organizationData,
    loading: organizationsLoading,
    error: organizationsError,
  } = useListOrganizationsQuery()
  const [deleteOrganization] = useDeleteOrganizationMutation({
    update(cache, { data }) {
      cache.modify({
        fields: {
          listOrganizations(existingOrganizations = [], { readField }) {
            return [
              ...(existingOrganizations as any[]).filter(item => {
                return readField('_id', item) !== data?.deleteOrganization
              }),
            ]
          },
        },
      })
    },
  })
  const [createOrganization] = useCreateOrganizationMutation({
    update(cache, { data }) {
      cache.modify({
        fields: {
          listOrganizations(existingOrganizations = []) {
            const newOrganizationRef = cache.writeFragment({
              data: data?.createOrganization,
              fragment: gql`
                fragment NewOrganization on Organization {
                  _id
                  name
                  owner {
                    _id
                  }
                  members {
                    _id
                    email
                  }
                }
              `,
            })
            return [...existingOrganizations, newOrganizationRef]
          },
        },
      })
    },
  })
  const [newOrgName, setNewOrgName] = useState('')
  const createNewOrg = async () => {
    await createOrganization({
      variables: {
        organization: {
          name: newOrgName,
        },
      },
    })
    setNewOrgName('')
  }
  if (organizationsError) {
    return (
      <div>
        Error loading organizations: {JSON.stringify(organizationsError)}
      </div>
    )
  }
  if (organizationsLoading) {
    return <div>Loading...</div>
  }
  return (
    <div style={{ margin: '10px', padding: '10px'}} >
      <h1>Organizations</h1>
      <div  style={{ margin: '10px', padding: '10px', fontSize:'16px'}} >
        {organizationData?.listOrganizations.map(orgs => (
          <div key={orgs._id} >
            <span>{orgs.name}</span>
            <span>
              <button style={{ margin: '10px'}}
                onClick={() =>
                  deleteOrganization({
                    variables: { organizationId: orgs._id },
                  })
                }
              >
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
      <div>
        <h2>Create New Organization</h2>
        <div  style={{ margin: '10px', padding: '10px'}} >
          <input
            type="text"
            value={newOrgName}
            onChange={e => {
              const name = e.currentTarget.value
              setNewOrgName(name)
            }}
          />
          <button style={{ margin: '10px', fontSize:'20px',backgroundColor: 'fuchsia'}} onClick={() => createNewOrg()}>Create</button>
        </div>
      </div>
      <button onClick={() => navigate('/projects')}>Go to projects</button>
    </div>
  )
}

export default Organizations
