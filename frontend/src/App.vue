<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import AppFooter from '@/components/AppFooter/AppFooter.vue'
import ToastNotification from '@/components/ToastNotification/ToastNotification.vue'
import CookieConsent from '@/components/CookieConsent/CookieConsent.vue'

const route = useRoute()
</script>

<template>
  <div class="app-layout">
    <AppHeader v-if="!route.meta.hideHeader" />
    <main>
      <router-view />
    </main>
    <AppFooter v-if="!route.meta.hideFooter" />
    <ToastNotification />
    <CookieConsent />
  </div>
</template>

<style>
@import '@/assets/main.css';

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 60px;
}

@media (max-width: 768px) {
  main {
    padding: 16px 16px 40px;
  }
}

@media (max-width: 480px) {
  main {
    padding: 12px 12px 32px;
  }
}

</style>
