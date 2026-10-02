import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import { setTokens } from '@/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
authStore.loadState()
if (authStore.isAuthenticated && authStore.accessToken) {
  setTokens(authStore.accessToken, authStore.refreshToken)
  authStore.fetchUser().catch(() => authStore.logout())
}

app.mount('#app')
