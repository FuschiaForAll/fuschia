import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client'

export const currentProjectIdVar = makeVar(
  localStorage.getItem('currentProjectId')
)

const httpLink = createHttpLink({
  uri: 'https://localhost:4003/graphql',
  credentials: 'include',
})
const appLink = createHttpLink({
  uri: 'http://localhost:4005',
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
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'app-server',
    appLink,
    httpLink
  ),
  cache,
})
