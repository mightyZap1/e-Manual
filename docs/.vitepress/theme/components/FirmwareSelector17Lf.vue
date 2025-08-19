// docs/.vitepress/theme/components/FirmwareSelector.vue

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { useData } from 'vitepress'
const { lang } = useData()
const selectedModel = ref('27mm')
const models = ['27mm', '37mm', '50mm', '87mm']

const koComponents = {
  // ✅ '/'로 시작하면 최상위 'docs' 폴더를 기준으로 경로를 찾습니다.
  // 이 방법이 가장 간단하고 실수가 적습니다.
  '27mm': () => import('/actuator/Mini17Lf/firmware/27mm.md'),
  '37mm': () => import('/actuator/Mini17Lf/firmware/37mm.md'),
  '50mm': () => import('/actuator/Mini17Lf/firmware/50mm.md'),
  '87mm': () => import('/actuator/Mini17Lf/firmware/87mm.md'),
}
const enComponents = {
  // ✅ '/'로 시작하면 최상위 'docs' 폴더를 기준으로 경로를 찾습니다.
  // 이 방법이 가장 간단하고 실수가 적습니다.
  '27mm': () => import('/en/actuator/Mini17Lf/firmware/27mm.md'),
  '37mm': () => import('/en/actuator/Mini17Lf/firmware/37mm.md'),
  '50mm': () => import('/en/actuator/Mini17Lf/firmware/50mm.md'),
  '87mm': () => import('/en/actuator/Mini17Lf/firmware/87mm.md'),
}

const activeComponent = computed(() => {
    // ⚙️ 3. 현재 언어가 'en'으로 시작하는지 확인합니다.
    const isEnglish = lang.value.startsWith('en')
  
  // ⚙️ 4. 언어에 따라 적절한 컴포넌트 목록을 선택합니다.
  const components = isEnglish ? enComponents : koComponents
  
  // 선택된 모델에 해당하는 컴포넌트를 비동기로 로드합니다.
  return defineAsyncComponent(components[selectedModel.value])
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
        {{ model }} 
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