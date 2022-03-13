import React, { useEffect, useState } from 'react'
import { getIntrospectionQuery } from 'graphql'

interface GraphQLDesignerProps {
  sandboxEndpoint?: string | null
  liveEndpoint?: string | null
}
function recursiveTypeOf(ofType: any): String {
  if (ofType.ofType) {
    return recursiveTypeOf(ofType.ofType)
  }
  return ofType.name
}

const GraphQLDesigner: React.FC<GraphQLDesignerProps> =
  function GraphQLDesigner({ sandboxEndpoint, liveEndpoint }) {
    const [introspectionData, setIntrospectionData] = useState<any>()
    useEffect(() => {
      if (sandboxEndpoint) {
        fetch(sandboxEndpoint, {
          method: 'POST',
          body: JSON.stringify({
            query: getIntrospectionQuery(),
            variables: {},
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(result => {
            setIntrospectionData(result.data)
          })
          .catch(e => console.log(e))
      }
    }, [sandboxEndpoint])
    useEffect(() => {
      if (introspectionData) {
        // const schema = buildClientSchema(introspectionData, {})
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
