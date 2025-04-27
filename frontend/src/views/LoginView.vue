<template>
  <div class="auth-page">
    <h2 class="title">Login</h2>
    <form @submit.prevent="loginUser" class="form-group">
      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <input v-model="password" type="password" placeholder="Password" required />
      </div>
      <button type="submit">Submit</button>&nbsp;&nbsp;
      <router-link to="/register">Don't have an account? Register</router-link>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { LOGIN_MUTATION } from '../graphql/mutations'
import { useAuthStore } from '../stores/auth.store'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    const email = ref('')
    const password = ref('')

    const { mutate: login } = useMutation(LOGIN_MUTATION)

    const loginUser = async () => {
      try {
        const response = await login({
          email: email.value,
          password: password.value
        })
        if (response) {
          window.location.href = '/'
        }
        authStore.setUser(response.data.login.user)
      } catch (error) {
        console.error(error)
        alert('Login failed')
      }
    }

    return { email, password, loginUser }
  }
})
</script>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: auto;
}
.title {
  text-align: center;
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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
