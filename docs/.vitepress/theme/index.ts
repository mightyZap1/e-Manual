// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom' // 이미지 확대 라이브러리 import

// 사용자 정의 전역 컴포넌트 import (경로는 실제 위치에 맞게 조정하세요)
import FirmwareSelector12Lf from './components/FirmwareSelector.vue'
import FirmwareSelector17Lf from './components/FirmwareSelector17Lf.vue'

import './custom.css' // 커스텀 CSS 파일 import

export default {
  ...DefaultTheme,

  // enhanceApp은 전역 컴포넌트 등록 전용으로 사용합니다.
  enhanceApp({ app }) {
    app.component('FirmwareSelector17Lf', FirmwareSelector17Lf)
    app.component('FirmwareSelector12Lf', FirmwareSelector12Lf)

  },


}
