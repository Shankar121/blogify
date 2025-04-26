import { createApp, h, provide, onBeforeUnmount } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { getMainDefinition } from '@apollo/client/utilities'
// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:3000/graphql',
  credentials: 'include'
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3000/graphql'
  })
)

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)
// Cache implementation
const cache = new InMemoryCache({
  resultCaching: false
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link,
  cache
})

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient),
      onBeforeUnmount(() => {
        // Optionally, clean up any resources or subscriptions if needed
        apolloClient.stop() // Stops the Apollo client if needed
      })
  },

  render: () => h(App)
})

app.use(createPinia())
app.use(router)

app.mount('#app')
