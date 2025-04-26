<template>
  <div>
    <h1>My Blogs</h1>
    <div v-if="loading"><Loading /></div>
    <div v-if="error" class="error">{{ error.message }}</div>
    <div v-if="!loading && blogs.length === 0" class="no-blogs">No blogs available.</div>
    <ul v-if="!loading && blogs.length > 0">
      <li v-for="blog in blogs" :key="blog._id">
        <h2>{{ blog.title }}</h2>
        <small>Published At: {{ new Date(blog.createdAt).toLocaleString() }}</small>
        <p>{{ blog.content }}</p>
        <div class="tags">
          <span v-for="tag in blog.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Loading from '../components/Loading.vue'
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const GET_BLOGS = gql`
  query MyBlogs {
    myblogs {
      _id
      title
      content
      tags
      createdAt
    }
  }
`

export default defineComponent({
  name: 'MyBlogs',
  setup() {
    const { result, loading, error, refetch } = useQuery(GET_BLOGS)
    const blogs = ref<any[]>([])
    watch(result, (newResult) => {
      if (newResult && newResult.myblogs) {
        blogs.value = newResult.myblogs
      }
    })
    onMounted(() => {
      refetch()
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
  font-size: 0.7rem;
}
.no-blogs {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 2rem;
}
.tags {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.tag {
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.3s;
}

.tag:hover {
  background: linear-gradient(135deg, #388e3c, #66bb6a);
}
</style>
