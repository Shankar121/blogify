<template>
  <div class="auth-page">
    <h2 class="title">Register with us</h2>
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <input v-model="firstName" type="text" placeholder="First Name" required />
      </div>
      <div class="form-group">
        <input v-model="lastName" type="text" placeholder="Last Name" required />
      </div>
      <div class="form-group">
        <input v-model="phone" type="text" placeholder="Phone" required />
      </div>
      <div class="form-group">
        <input v-model="password" type="password" placeholder="Password" required />
      </div>
      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email" required />
      </div>
      <button type="submit">Submit</button>&nbsp;&nbsp;
      <router-link to="/login">Already have an account? Login</router-link>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { REGISTER_MUTATION } from '../graphql/mutations'

export default defineComponent({
  setup() {
    const firstName = ref('')
    const lastName = ref('')
    const phone = ref('')
    const email = ref('')
    const password = ref('')

    const { mutate: register } = useMutation(REGISTER_MUTATION)

    const registerUser = async () => {
      try {
        await register({
          data: {
            firstName: firstName.value,
            lastName: lastName.value,
            phone: phone.value,
            email: email.value,
            password: password.value
          }
        })
        window.location.href = '/login'
      } catch (error) {
        console.error(error)
        alert('Registration failed')
      }
    }

    return { firstName, lastName, phone, email, password, registerUser }
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
