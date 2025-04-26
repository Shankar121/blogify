<template>
  <header class="header-wrapper">
    <div class="flex items-center space-x-2">
      <img src="/icons/logo.svg" alt="Blogify Logo" />
    </div>

    <nav class="flex space-x-6">
      <router-link to="/">Home</router-link>
      <router-link to="/myblogs">My Blogs</router-link>
      <router-link to="/blogs/new">Create Blog</router-link>
    </nav>

    <div>
      Hello, {{ authStore.user ? authStore.user.firstName : '' }}
      &nbsp; &nbsp; &nbsp;
      <button
        v-if="isLoggedIn"
        @click="logoutUser"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
      <router-link
        v-else
        to="/login"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </router-link>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => !!authStore.user)
const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`
const { mutate: logout } = useMutation(LOGOUT_MUTATION)

const logoutUser = async () => {
  try {
    await logout({
      mutation: LOGOUT_MUTATION
    })

    authStore.logout()
    await router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const ME_QUERY = gql`
  query Me {
    me {
      id
      firstName
      lastName
      phone
      email
    }
  }
`

onMounted(() => {
  const { result, onError } = useQuery(ME_QUERY, {}, { fetchPolicy: 'network-only' })

  onError((error) => {
    console.error('Failed to fetch user', error)
  })

  watch(result, (value) => {
    if (value?.me) {
      authStore.setUser(value.me)
    }
  })
})
</script>

<style scoped>
.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
}
button {
  padding: 0.5rem 1rem;
  background-color: #12b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #46c39a;
}
</style>
