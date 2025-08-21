<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'
import HomePage from './HomePage.vue'
import HomePageEn from './HomePage_en.vue'
import DocInfo from './DocInfo.vue'

const { Layout } = DefaultTheme
const { frontmatter, lang } = useData()
const route = useRoute()

// --- KaTeX 렌더링 로직 ---

// 스크립트가 한 번만 로드되도록 관리하는 Promise
let katexPromise = null

function ensureKatexLoaded() {
  if (!katexPromise) {
    katexPromise = new Promise((resolve, reject) => {
      // 브라우저 환경에서만 실행
      if (typeof window === 'undefined') return resolve();
      // 이미 로드되었다면 즉시 해결
      if (window.katex && window.renderMathInElement) {
        return resolve();
      }

      // 1. CSS 로드
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(css);

      // 2. KaTeX 핵심 JS 로드
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.onload = () => {
        // 3. 자동 렌더링 확장 JS 로드
        const autoRenderScript = document.createElement('script');
        autoRenderScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
        autoRenderScript.onload = resolve; // 모든 스크립트 로드가 완료되면 Promise 해결
        autoRenderScript.onerror = reject;
        document.head.appendChild(autoRenderScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return katexPromise;
}

// 수학식을 렌더링하는 메인 함수
async function renderMath() {
  if (typeof window === 'undefined') return;

  try {
    await ensureKatexLoaded();
    if (window.renderMathInElement) {
      // 페이지 전체에서 수학식을 찾아 렌더링
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false // 오류가 있어도 멈추지 않음
      });
    }
  } catch (error) {
    console.error('KaTeX 렌더링 실패:', error);
  }
}

// 페이지가 처음 로드될 때 실행
onMounted(() => {
  renderMath();
});

// 다른 페이지로 이동할 때마다 실행
watch(
  () => route.path,
  () => {
    // VitePress가 페이지 DOM 업데이트를 완료한 후 실행
    nextTick(() => {
      renderMath();
    });
  }
);
</script>

<template>
  <Layout>
    <!-- 홈페이지일 경우 HomePage 컴포넌트를 표시하는 로직 -->
    <template #doc-before>
      <template v-if="frontmatter.isHomePage">
        <HomePage v-if="!lang.startsWith('en')" />
        <HomePageEn v-else />
      </template>
    </template>
    
    <!-- 페이지 상단에 DocInfo를 표시하는 슬롯 -->
    <template #page-top>
      <ClientOnly>
        <DocInfo />
      </ClientOnly>
    </template>
  </Layout>
</template>
