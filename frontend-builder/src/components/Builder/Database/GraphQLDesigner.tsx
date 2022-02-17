import React, { useEffect } from 'react'
import { getIntrospectionQuery, buildClientSchema } from 'graphql'
import { useQuery, gql } from '@apollo/client'

function recursiveTypeOf(ofType: any): String {
  if (ofType.ofType) {
    return recursiveTypeOf(ofType.ofType)
  }
  return ofType.name
}

const GraphQLDesigner: React.FC = function GraphQLDesigner() {
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
  if (!introspectionData) {
    return <div>Loading...</div>
  }
  return (
    <div>
      GraphQLDesigner
      {introspectionData.__schema.types.map((type: any, idx: number) => (
        <React.Fragment key={idx}>
          <h2>{type.name}</h2>
          <div>
            {type.fields?.map((field: any) => (
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
