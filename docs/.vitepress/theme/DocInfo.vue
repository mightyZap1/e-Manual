<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page, frontmatter } = useData()

// 날짜 형식을 'YYYY-MM-DD HH:mm'로 변환하는 함수
const formatDate = (timestamp) => {
  if (!timestamp) return null
  const date = new Date(timestamp)
  return date.toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).replace(/\.$/, ''); // 시간/분 부분을 모두 삭제
//   return date.toLocaleDateString('ko-KR', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   }).replace(/\.$/, '') + ' ' + date.toLocaleTimeString('ko-KR', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false
//   });
}

const lastUpdatedText = computed(() => formatDate(page.value.lastUpdated))
</script>

<template>
  <div v-if="frontmatter.version || lastUpdatedText" class="doc-info">
    <div v-if="frontmatter.version" class="version-tag">
      <strong>Version:</strong> {{ frontmatter.version }}
    </div>
    <div v-if="lastUpdatedText" class="last-updated-tag">
      <strong>Last Updated:</strong> {{ lastUpdatedText }}
    </div>
  </div>
</template>

<style scoped>
.doc-info {
  margin-top: 16px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
 
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
.version-tag, .last-updated-tag {
  background-color: var(--vp-c-bg-soft);
  /* padding: 4px 12px; */
  border-radius: 8px;
}
</style>