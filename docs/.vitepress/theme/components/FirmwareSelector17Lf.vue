// docs/.vitepress/theme/components/FirmwareSelector.vue

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'

const selectedModel = ref('27mm')
const models = ['27mm', '37mm', '50mm', '87mm']

const modelComponents = {
  // ✅ '/'로 시작하면 최상위 'docs' 폴더를 기준으로 경로를 찾습니다.
  // 이 방법이 가장 간단하고 실수가 적습니다.
  '27mm': () => import('/actuator/Mini17Lf/firmware/27mm.md'),
  '37mm': () => import('/actuator/Mini17Lf/firmware/37mm.md'),
  '50mm': () => import('/actuator/Mini17Lf/firmware/50mm.md'),
  '87mm': () => import('/actuator/Mini17Lf/firmware/87mm.md'),
}

const activeComponent = computed(() => {
  return defineAsyncComponent(modelComponents[selectedModel.value])
})
</script>

<template>
  <div class="firmware-selector">
    <div class="tabs">
      <button
        v-for="model in models"
        :key="model"
        :class="{ active: selectedModel === model }"
        @click="selectedModel = model"
      >
        {{ model }} 모델
      </button>
    </div>
    <div class="content">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<style scoped>
/* 스타일은 이전 답변과 동일합니다 */
.tabs { display: flex; gap: 8px; border-bottom: 1px solid #ddd; margin-bottom: 16px; }
.tabs button { padding: 8px 16px; border: none; background: none; cursor: pointer; }
.tabs button.active { color: #3eaf7c; border-bottom: 2px solid #3eaf7c; font-weight: 600; }
</style>