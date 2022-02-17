import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client'

export const currentProjectIdVar = makeVar(
  localStorage.getItem('currentProjectId')
)

const httpLink = createHttpLink({
  uri: 'https://localhost:4001/graphql',
  credentials: 'include',
})

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentProjectId: {
          read() {
            return currentProjectIdVar()
          },
        },
      },
    },
  },
})

export const client = new ApolloClient({
  link: httpLink,
  cache,
})
