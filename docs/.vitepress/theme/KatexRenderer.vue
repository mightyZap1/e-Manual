<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

// KaTeX 렌더링을 시도하는 함수
function tryRenderKatex() {
  // `renderMathInElement` 함수가 로드되었는지 확인
  if (window.renderMathInElement) {
    // 함수가 있으면 즉시 렌더링 실행
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ]
    });
  } else {
    // 함수가 아직 로드되지 않았으면, 0.1초 간격으로 최대 10번 재시도
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.renderMathInElement) {
        clearInterval(interval); // 성공하면 타이머 중지
        window.renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ]
        });
      } else if (attempts >= 10) {
        clearInterval(interval); // 1초 후에도 실패하면 중지하고 에러 메시지 표시
        console.error("KaTeX 라이브러리를 로드하지 못했습니다.");
      }
      attempts++;
    }, 100);
  }
}

// 컴포넌트가 처음 마운트될 때 렌더링 시도
onMounted(() => {
  tryRenderKatex()
})

// 페이지 경로가 변경될 때마다 렌더링 시도 (SPA 네비게이션용)
watch(() => route.path, () => {
  // Vue가 DOM 업데이트를 완료한 후에 실행하도록 nextTick 사용
  import('vue').then(vue => {
    vue.nextTick(() => {
      tryRenderKatex()
    });
  });
})
</script>

<template></template>