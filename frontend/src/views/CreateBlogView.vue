<template>
  <div class="create-blog">
    <h1>Create a New Blog</h1>

    <form @submit.prevent="submitBlog">
      <div class="form-group">
        <label for="title">Title:</label>
        <input v-model="title" id="title" type="text" required />
      </div>

      <div class="form-group">
        <label for="content">Content:</label>
        <textarea v-model="content" id="content" required></textarea>
      </div>

      <div class="form-group">
        <label for="tags">Tags:</label>
        <input v-model="tags" id="tags" type="text" placeholder="Comma separated tags" />
      </div>

      <button type="submit">Create Blog</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { CREATE_BLOG_MUTATION } from '../graphql/mutations'
import { useAuthStore } from '../stores/auth.store'

export default defineComponent({
  name: 'CreateBlog',
  setup() {
    const { mutate: createBlog } = useMutation(CREATE_BLOG_MUTATION)

    const title = ref('')
    const content = ref('')
    const tags = ref('')

    const submitBlog = async () => {
      try {
        const response = await createBlog({
          data: {
            title: title.value,
            content: content.value,
            tags: tags.value.split(',').map((tag: string) => tag.trim()) // Split tags into array
          }
        })
        window.location.href = '/myblogs' // Redirect to My Blogs page after creation
      } catch (error) {
        console.error('Error creating blog:', error)
      }
    }

    return {
      title,
      content,
      tags,
      submitBlog
    }
  }
})
</script>

<style scoped>
.create-blog {
  max-width: 600px;
  margin: 0 auto;
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
