<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import { useRoute, useData } from 'vitepress'
import HomePage from './HomePage.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

// --- ⬇️ KaTeX 로딩 및 렌더링 로직 (수정됨) ---

let isKatexLoaded = false; // 스크립트가 이미 로드되었는지 확인하는 플래그

// 스크립트를 동적으로 불러오는 함수
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// CSS를 동적으로 불러오는 함수
function loadCss(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// KaTeX 관련 모든 리소스를 순서대로 불러오는 함수
async function ensureKatexLoaded() {
  if (isKatexLoaded) return true;
  // 이미 어떤 이유로든 로드되었다면 다시 로드하지 않음
  if (window.katex) {
      isKatexLoaded = true;
      return true;
  }
  try {
    loadCss('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js');
    isKatexLoaded = true;
    return true;
  } catch (error) {
    console.error('KaTeX 스크립트 로딩 실패:', error);
    return false;
  }
}

// 수학식을 렌더링하는 메인 함수
async function renderMath() {
  const loaded = await ensureKatexLoaded();
  if (loaded && window.renderMathInElement) {
    // window.renderMathInElement는 auto-render.min.js가 로드되면 사용 가능
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ]
    });
  } else if (!loaded) {
      console.error('KaTeX 라이브러리를 로드하지 못했습니다.');
  }
}

// 페이지가 처음 마운트될 때 렌더링
onMounted(() => {
  renderMath();
});

// 다른 페이지로 이동할 때마다 다시 렌더링
watch(() => route.path, () => {
  // Vue가 DOM 업데이트를 완료한 후에 렌더링 함수를 호출
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