// docs/.vitepress/theme/components/FirmwareSelectorDL12.vue

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
// ⚙️ 1. VitePress에서 useData를 가져옵니다.
import { useData } from 'vitepress'

// ⚙️ 2. useData를 호출하여 페이지의 언어(lang) 등 정보에 접근합니다.
const { lang } = useData()

const selectedModel = ref('L12 30mm')
const models = ['D7D12', 'L12 30mm', 'L12 41mm', 'L12 56mm', 'L12 96mm']

// ✅ 한국어 경로 컴포넌트 목록
const koComponents = {
  'D7D12': () => import('/actuator/D7D12L12/firmware/D7D12.md'),
  'L12 30mm': () => import('/actuator/D7D12L12/firmware/3mm.md'),
  'L12 41mm': () => import('/actuator/D7D12L12/firmware/4mm.md'),
  'L12 56mm': () => import('/actuator/D7D12L12/firmware/6mm.md'),
  'L12 96mm': () => import('/actuator/D7D12L12/firmware/10mm.md')
}

// ✅ 영어 경로 컴포넌트 목록 ('/en' 추가)
const enComponents = {
  'D7D12': () => import('/actuator/D7D12L12/firmware/D7D12.md'),
  'L12 30mm': () => import('/en/actuator/D7D12L12/firmware/3mm.md'),
  'L12 41mm': () => import('/en/actuator/D7D12L12/firmware/4mm.md'),
  'L12 56mm': () => import('/en/actuator/D7D12L12/firmware/6mm.md'),
  'L12 96mm': () => import('/en/actuator/D7D12L12/firmware/10mm.md')
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
        {{ model }} </button>
    </div>
    <div class="content">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<style scoped>
/* 스타일은 동일 */
.tabs { display: flex; gap: 8px; border-bottom: 1px solid #ddd; margin-bottom: 16px; }
.tabs button { padding: 8px 16px; border: none; background: none; cursor: pointer; }
.tabs button.active { color: #3eaf7c; border-bottom: 2px solid #3eaf7c; font-weight: 600; }
</style>