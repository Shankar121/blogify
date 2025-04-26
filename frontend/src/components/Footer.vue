<template>
  <footer>
    <p>&copy; {{ currentYear }} Blogify. All rights reserved.</p>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentYear = new Date().getFullYear()
</script>

<style scoped>
footer {
  background-color: #f9fafb;
  padding: 1rem;
  text-align: center;
}
</style>
