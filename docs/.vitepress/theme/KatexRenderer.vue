<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();
let katexPromise = null;

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
function ensureKatexLoaded() {
  if (!katexPromise) {
    katexPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return resolve();
      if (window.katex && window.renderMathInElement) return resolve();

      loadCss('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');
      loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js')
        .then(() => loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js'))
        .then(resolve)
        .catch(reject);
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
      // 페이지 전체(document.body) 대신 메인 콘텐츠 영역(.vp-doc)만 대상으로 지정하여
      // 사이드바와의 충돌 가능성을 최소화합니다.
      const content = document.querySelector('.vp-doc');
      if (content) {
        window.renderMathInElement(content, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false
        });
      }
    }
  } catch (error) {
    console.error('KaTeX 렌더링 실패:', error);
  }
}

onMounted(renderMath);
watch(() => route.path, () => {
  // VitePress가 페이지 DOM 업데이트를 완료한 후 실행
  import('vue').then(({ nextTick }) => nextTick(renderMath));
});
</script>

<template>
  <!-- 이 컴포넌트는 UI를 렌더링하지 않고 스크립트만 실행합니다. -->
  <div style="display: none;"></div>
</template>