<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HomePage from './HomePage.vue'
import HomePageEn from './HomePage_en.vue'
import DocInfo from './DocInfo.vue'
import KatexRenderer from './KatexRenderer.vue' // 1. KaTeX 컴포넌트 import

const { Layout } = DefaultTheme
const { frontmatter, lang } = useData()
</script>

<template>
  <Layout>
    <template #doc-before>
      <template v-if="frontmatter.isHomePage">
        <HomePage v-if="!lang.startsWith('en')" />
        <HomePageEn v-else />
      </template>
    </template>
    
    <template #page-top>
      <ClientOnly>
        <DocInfo />
      </ClientOnly>
    </template>

    <!-- 2. layout-bottom 슬롯에 ClientOnly로 감싸서 KatexRenderer를 추가 -->
    <!-- 이 컴포넌트는 브라우저에서만 실행되어 서버 렌더링과 충돌하지 않습니다. -->
    <template #layout-bottom>
      <ClientOnly>
        <KatexRenderer />
      </ClientOnly>
    </template>
  </Layout>
</template>