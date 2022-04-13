import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { createUploadLink } from 'apollo-upload-client'

export const currentProjectIdVar = makeVar(
  localStorage.getItem('currentProjectId')
)
export const scaleFactorVar = makeVar(localStorage.getItem('scaleFactor'))
export const previewerStateVar = makeVar(localStorage.getItem('previewerData'))
export const selectionVar = makeVar<string[]>([])
export const stackFilterVar = makeVar<string>('')

const httpLink = createUploadLink({
  uri: `${process.env.REACT_APP_GQL_ENDPOINT}/graphql`,
  credentials: 'include',
})
const appLink = createHttpLink({
  uri: 'http://localhost:4005',
  credentials: 'include',
})

const wsLink = new WebSocketLink({
  uri: `wss://localhost:4003/subscriptions`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
      return window.localStorage.getItem('wsToken')
    },
  },
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink as unknown as ApolloLink
)

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
        stackFilter: {
          read() {
            return stackFilterVar()
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
    splitLink
  ),
  cache,
})
