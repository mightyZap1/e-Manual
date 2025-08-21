<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import { useRoute, useData } from 'vitepress'
import HomePage from './HomePage.vue' // HomePage.vue를 사용하고 있다면 그대로 둡니다.

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

// KaTeX 렌더링 함수
function renderMath() {
  // window.katex가 로드되었는지 확인
  if (window.katex) {
    // 이전에 렌더링된 내용을 초기화 (중복 렌더링 방지)
    const rendered = document.querySelectorAll('.katex-rendered');
    rendered.forEach(el => {
      const parent = el.parentElement;
      if (parent && parent.dataset.originalContent) {
        parent.innerHTML = parent.dataset.originalContent;
      }
    });

    // renderMathInElement 함수를 직접 호출
    // 이 함수는 KaTeX.js에 포함되어 있습니다.
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ]
    });
  }
}

// 페이지가 처음 마운트될 때 렌더링
onMounted(() => {
  renderMath();
})

// 다른 페이지로 이동할 때마다 다시 렌더링
watch(() => route.path, () => {
  // DOM 업데이트를 기다린 후 렌더링
  import('vue').then(({ nextTick }) => {
    nextTick(() => {
      renderMath();
    });
  });
});
</script>

<template>
  <Layout>
    <template #doc-after>
      <HomePage v-if="frontmatter.isHomePage" />
    </template>
  </Layout>
</template>