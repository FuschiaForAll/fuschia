export const baseApp = `import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { RootNavigator } from './RootNavigator'
import { ApolloProvider } from '@apollo/client'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { apolloClient } from './apollo-client'

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
      </SafeAreaProvider>
    </ApolloProvider>  
  )
}

export default App`
