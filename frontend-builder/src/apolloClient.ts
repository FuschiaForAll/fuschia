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
export const previewerStateVar = makeVar(localStorage.getItem('previewerData'))
export const selectionVar = makeVar<string[]>([])

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_GQL_ENDPOINT}/graphql`,
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
        previewerState: {
          read() {
            return previewerStateVar()
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
