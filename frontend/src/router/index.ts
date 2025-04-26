import { createRouter, createWebHistory } from 'vue-router'
import BlogListView from '../views/BlogListView.vue'
import MyBlogsView from '../views/MyBlogsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CreateBlogView from '@/views/CreateBlogView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BlogListView
    },
    {
      path: '/myblogs',
      name: 'myblogs',
      component: MyBlogsView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/blogs/:id',
      name: 'create-blog',
      component: CreateBlogView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
