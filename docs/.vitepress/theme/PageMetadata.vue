<script setup>
import { useData } from 'vitepress'

// useData()를 통해 현재 페이지의 frontmatter 데이터를 가져옵니다.
const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.modified || frontmatter.version" class="page-metadata">
    <p v-if="frontmatter.modified">
      <strong>수정일:</strong> {{ frontmatter.modified }}
    </p>
    <p v-if="frontmatter.version">
      <strong>버전:</strong> {{ frontmatter.version }}
    </p>
  </div>
</template>

<style scoped>
.page-metadata {

  border-radius: 8px;
  padding: 12px 18px;
  margin-bottom: 24px;
  font-size: 0.9rem;
  color: #555;
  text-align: right;
}
.page-metadata p {
  margin: 4px 0;
  line-height: 1.6;
}
</style>