<template>
  <div>
    <h1>Blog List</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error.message }}</div>
    <div v-if="!loading && blogs.length === 0">No blogs available.</div>
    <ul v-if="!loading && blogs.length > 0">
      <li v-for="blog in blogs" :key="blog._id">
        <h2>{{ blog.title }}</h2>
        <p>{{ blog.content }}</p>
        <small>Created at: {{ new Date(blog.createdAt).toLocaleString() }}</small>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const GET_BLOGS = gql`
  query GetBlogs {
    blogs {
      _id
      title
      content
      createdAt
    }
  }
`

export default defineComponent({
  name: 'BlogList',
  setup() {
    const { result, loading, error } = useQuery(GET_BLOGS)
    const blogs = ref<any[]>([])

    watch(result, (newResult) => {
      console.log('Blogs:', newResult)
      if (newResult && newResult.blogs) {
        blogs.value = newResult.blogs
      }
    })

    return {
      blogs,
      loading,
      error
    }
  }
})
</script>

<style scoped>
h1 {
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  border-bottom: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}

.error {
  color: red;
  text-align: center;
}

small {
  color: gray;
  font-size: 0.9rem;
}
</style>
