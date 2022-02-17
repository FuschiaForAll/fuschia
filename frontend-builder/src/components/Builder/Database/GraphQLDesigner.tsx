import { ratingClasses } from '@mui/material'
import React, { useEffect } from 'react'
import { useIntrospectionQueryQuery } from '../../../generated/graphql'
import { getIntrospectionQuery, buildClientSchema } from 'graphql'
import { useQuery, gql } from '@apollo/client'

function recursiveTypeOf(ofType: any): String {
  if (ofType.ofType) {
    return recursiveTypeOf(ofType.ofType)
  }
  return ofType.name
}

const GraphQLDesigner: React.FC = function GraphQLDesigner() {
  const { data: graphData } = useIntrospectionQueryQuery()
  const { data: introspectionData } = useQuery(
    gql`
      ${getIntrospectionQuery()}
    `,
    { context: { clientName: 'app-server' } }
  )
  useEffect(() => {
    if (introspectionData) {
      const schema = buildClientSchema(introspectionData, {})
      console.log(schema)
    }
  }, [introspectionData])
  if (!graphData) {
    return <div>Loading....</div>
  }
  return (
    <div>
      GraphQLDesigner
      {graphData.__schema.types.map((type, idx) => (
        <React.Fragment key={idx}>
          <h2>{type.name}</h2>
          <div>
            {type.fields?.map(field => (
              <div key={field.name}>
                <span>
                  {field.name} - {field.type.name}{' '}
                  {field.type.ofType && recursiveTypeOf(field.type.ofType)}
                </span>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
      <pre>{JSON.stringify(introspectionData, null, 2)}</pre>
    </div>
  )
}

export default GraphQLDesigner
