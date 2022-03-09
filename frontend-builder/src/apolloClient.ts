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
export const scaleFactorVar = makeVar(localStorage.getItem('scaleFactor'))

export const selectionVar = makeVar<string[]>([])

const httpLink = createHttpLink({
  uri: 'https://localhost:4003/graphql',
  credentials: 'include',
})
const appLink = createHttpLink({
  uri: 'http://localhost:4005',
  credentials: 'include',
})
const packageLink = createHttpLink({
  uri: 'http://localhost:4006',
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
        scaleFactor: {
          read() {
            return scaleFactorVar()
          },
        },
        selection: {
          read() {
            return selectionVar()
          },
        },
      },
    },
  },
})

export const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'package-manager',
    packageLink,
    ApolloLink.split(
      operation => operation.getContext().clientName === 'app-server',
      appLink,
      httpLink
    )
  ),
  cache,
})
