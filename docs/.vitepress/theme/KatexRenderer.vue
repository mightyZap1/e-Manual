<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();
let katexPromise = null;

function ensureKatexLoaded() {
  if (!katexPromise) {
    katexPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return resolve();
      if (window.katex && window.renderMathInElement) return resolve();

      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(css);

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.onload = () => {
        const autoRenderScript = document.createElement('script');
        autoRenderScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
        autoRenderScript.onload = resolve;
        autoRenderScript.onerror = reject;
        document.head.appendChild(autoRenderScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return katexPromise;
}

async function renderMath() {
  if (typeof window === 'undefined') return;
  try {
    await ensureKatexLoaded();
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false
      });
    }
  } catch (error) {
    console.error('KaTeX 렌더링 실패:', error);
  }
}

onMounted(renderMath);
watch(() => route.path, () => {
  import('vue').then(({ nextTick }) => nextTick(renderMath));
});
</script>

<template>
  <!-- 이 컴포넌트는 UI를 렌더링하지 않고 스크립트만 실행합니다. -->
  <div style="display: none;"></div>
</template>