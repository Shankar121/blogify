<template>
  <div>
    <h1>Blog List</h1>
    <div v-if="loading"><Loading /></div>
    <div v-if="error" class="error">{{ error.message }}</div>
    <div v-if="!loading && blogs.length === 0" class="no-blogs">No blogs available.</div>
    <ul v-if="!loading && blogs.length > 0">
      <li v-for="blog in blogs" :key="blog.title">
        <h2>{{ blog.title }}</h2>
        <small>Published At: {{ new Date(blog.createdAt).toLocaleString() }}</small>
        <br />
        <author>By {{ blog.author.firstName }} {{ blog.author.lastName }}</author>
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
import { useQuery, useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const GET_BLOGS = gql`
  query GetBlogs {
    blogs {
      title
      content
      tags
      author {
        firstName
        lastName
      }
      createdAt
    }
  }
`

const BLOG_CREATED_SUBSCRIPTION = gql`
  subscription BlogCreated {
    blogCreated {
      title
      content
      tags
      author {
        firstName
        lastName
      }
      createdAt
    }
  }
`

export default defineComponent({
  name: 'BlogList',
  setup() {
    const blogs = ref<any[]>([])
    const { result, refetch, loading, error } = useQuery(GET_BLOGS)

    watch(result, (newResult) => {
      if (newResult?.blogs) {
        blogs.value = newResult.blogs
      }
    })

    onMounted(() => {
      refetch()
    })

    const { result: subscriptionResult } = useSubscription(BLOG_CREATED_SUBSCRIPTION)
    console.log('Subscription result:', subscriptionResult)

    watch(
      () => subscriptionResult.value,
      (newBlog) => {
        console.log('Subscription newBlog:', newBlog, result.value)

        if (newBlog && newBlog.blogCreated) {
          if (result?.value?.blogs?.length > 0) {
            blogs.value = [newBlog.blogCreated, ...result.value?.blogs]
          } else {
            blogs.value = [newBlog.blogCreated]
          }
        }
      }
    )

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
author {
  font-size: 0.7rem;
  color: #0d9e24;
  font-weight: 400;
}
</style>
