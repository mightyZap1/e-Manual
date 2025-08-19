// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { h,resolveComponent  } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom' // 이미지 확대 라이브러리 import

// 사용자 정의 전역 컴포넌트 import (경로는 실제 위치에 맞게 조정하세요)
import KatexRenderer from './KatexRenderer.vue' // 1. 만든 컴포넌트 import
import FirmwareSelectorDL12 from './components/FirmwareSelectorDL12.vue'
import FirmwareSelector12Lf from './components/FirmwareSelector.vue'
import FirmwareSelector17Lf from './components/FirmwareSelector17Lf.vue'
import PageMetadata from './PageMetadata.vue' // 2단계에서 만든 컴포넌트 import
import HomePage from './HomePage.vue' //
import HomePageEn from './HomePage_en.vue' //
import './custom.css' // 커스텀 CSS 파일 import

export default {
  ...DefaultTheme,
  Layout: () => {
    const ClientOnly = resolveComponent('ClientOnly')
    return h(DefaultTheme.Layout, null, {
      // 'doc-before'는 문서 내용이 시작되기 전의 공간을 의미합니다.
      // 이 슬롯에 PageMetadata 컴포넌트를 렌더링합니다.
      'doc-before': () => h(PageMetadata),
      'layout-bottom': () => h(KatexRenderer),
    })
  },
  // enhanceApp은 전역 컴포넌트 등록 전용으로 사용합니다.
  enhanceApp({ app }) {
    app.component('FirmwareSelector17Lf', FirmwareSelector17Lf)
    app.component('FirmwareSelector12Lf', FirmwareSelector12Lf)
    app.component('FirmwareSelectorDL12', FirmwareSelectorDL12)
    app.component('HomePage', HomePage)
    app.component('HomePageEn', HomePageEn)
  },


}
