<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const route = useRoute()
const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)

function onDocumentClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element) || !target.closest('.header')) {
    closeMenu()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header class="header" data-testid="header">
    <div class="header-inner">
      <router-link to="/clubs" class="header-brand" data-testid="logo-link">
        Читальная
      </router-link>

      <nav class="header-nav" data-testid="main-nav">
        <router-link to="/clubs" class="header-nav-link" data-testid="clubs-link">
          <svg class="header-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
          Клубы
        </router-link>
        <router-link v-if="isAuthenticated" to="/clubs/create" class="header-nav-link" data-testid="create-club-link">
          <svg class="header-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Создать клуб
        </router-link>
        <router-link v-if="isAuthenticated" to="/profile" class="header-nav-link" data-testid="profile-link">
          <svg class="header-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Профиль
        </router-link>
      </nav>

      <div class="header-actions">
        <router-link v-if="!isAuthenticated" to="/signin" class="header-cta" data-testid="signin-link">
          <svg class="header-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Войти
        </router-link>

        <button
          class="burger"
          type="button"
          data-testid="burger-button"
          :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
          aria-controls="mobile-nav"
          :aria-expanded="menuOpen"
          @click="toggleMenu"
        >
          <span class="burger-bar" />
          <span class="burger-bar" />
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <nav v-if="menuOpen" class="mobile-menu">
        <router-link to="/clubs" class="mobile-menu-link">Клубы</router-link>
        <router-link v-if="isAuthenticated" to="/clubs/create" class="mobile-menu-link">
          Создать клуб
        </router-link>
        <router-link v-if="isAuthenticated" to="/profile" class="mobile-menu-link">Профиль</router-link>
        <router-link v-if="!isAuthenticated" to="/signin" class="mobile-menu-link">Войти</router-link>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  z-index: 100;
  width: 100%;
}

.header-inner {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px 10px;
}

.header-brand {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  line-height: 1;
  color: var(--color-text);
  text-decoration: none;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.header-brand:hover {
  color: var(--color-brand);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.header-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;
}

.header-nav-link:hover {
  color: var(--color-text);
  background: var(--color-stroke-subtle);
}

.header-nav-link.router-link-exact-active {
  color: var(--color-text);
  background: var(--color-stroke-subtle);
}

.header-icon {
  flex-shrink: 0;
  opacity: 0.5;
}

.header-nav-link:hover .header-icon,
.header-nav-link.router-link-exact-active .header-icon {
  opacity: 0.8;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-brand);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.header-cta:hover {
  background: var(--color-brand-soft);
}

.header-cta .header-icon {
  opacity: 0.7;
}

.header-cta:hover .header-icon {
  opacity: 1;
}

.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s ease;
}

.burger:hover {
  background: var(--color-stroke-subtle);
}

.burger-bar {
  display: block;
  width: 18px;
  height: 1.5px;
  border-radius: 2px;
  background: var(--color-text);
  transition:
    transform 0.3s var(--ease-out),
    opacity 0.3s var(--ease-out);
  transform-origin: center;
}

.burger[aria-expanded='true'] .burger-bar:first-child {
  transform: translateY(3.25px) rotate(45deg);
}

.burger[aria-expanded='true'] .burger-bar:last-child {
  transform: translateY(-3.25px) rotate(-45deg);
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 0 24px 12px;
  border-bottom: 1px solid var(--color-stroke-subtle);
}

.mobile-menu-link {
  display: block;
  padding: 10px 0;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.mobile-menu-link:hover {
  color: var(--color-text);
}

.mobile-menu-link.router-link-exact-active {
  color: var(--color-brand);
}

.mobile-menu-enter-active {
  transition: opacity 0.2s ease, transform 0.2s var(--ease-out);
}

.mobile-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 640px) {
  .header-inner {
    padding: 12px 24px;
  }

  .header-nav {
    display: none;
  }

  .header-cta {
    display: none;
  }

  .burger {
    display: flex;
    margin-left: auto;
  }

  .mobile-menu {
    display: flex;
    padding: 0 24px 12px;
  }
}
</style>
