<script setup lang="ts">
const navLinks = [
  { to: '/clubs', label: 'Все клубы' },
  { to: '/clubs/create', label: 'Создать клуб' },
  { to: '/profile', label: 'Мой профиль' },
]

const legalLinks = [
  { to: '/agreement', label: 'Согласие на обработку персональных данных' },
]
</script>

<template>
  <footer class="footer" data-testid="footer">
    <div class="footer-inner">
      <div class="footer-main">
        <div class="footer-brand">
          <router-link to="/" class="footer-brand-link" aria-label="Читальная — на главную">
            Читальная
          </router-link>

        </div>

        <nav class="footer-nav" aria-label="Разделы сайта">
          <div class="footer-col">
            <h2 class="footer-heading">Навигация</h2>
            <ul class="footer-list">
              <li v-for="link in navLinks" :key="link.to">
                <router-link :to="link.to" class="footer-link">{{ link.label }}</router-link>
              </li>
            </ul>
          </div>

          <div class="footer-col">
            <h2 class="footer-heading">Документы</h2>
            <ul class="footer-list">
              <li v-for="link in legalLinks" :key="link.to">
                <router-link :to="link.to" class="footer-link">{{ link.label }}</router-link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">© {{ new Date().getFullYear() }} Читальная</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-stroke-subtle);
  background: var(--color-surface);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 16px;
}

.footer-main {
  display: flex;
  justify-content: space-between;
  gap: 48px;
  align-items: flex-start;
}

.footer-brand {
  max-width: 340px;
}

.footer-brand-link {
  font-family: var(--font-display);
  font-size: 25px;
  font-weight: 400;
  line-height: 1.138;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-brand-link:hover {
  color: var(--color-brand);
}

.footer-nav {
  display: flex;
  gap: 64px;
}

.footer-col {
  min-width: 160px;
}

.footer-heading {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.footer-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-link {
  display: inline-block;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-brand);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1px solid var(--color-stroke-subtle);
}

.footer-copyright {
  font-size: 13px;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .footer-inner {
    padding: 20px 16px 16px;
  }

  .footer-main {
    flex-direction: column;
    gap: 20px;
  }

  .footer-nav {
    flex-direction: column;
    gap: 20px;
  }

  .footer-col {
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-top: 20px;
  }
}
</style>
