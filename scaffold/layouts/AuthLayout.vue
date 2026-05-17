<template>
  <div class="auth-shell">
    <div class="auth-shell__card vn-card">
      <header class="auth-shell__brand">
        <div class="auth-shell__logo">VN</div>
        <h1 class="auth-shell__title">VueNice Admin</h1>
      </header>
      <slot />
    </div>
    <footer class="auth-shell__foot vn-muted">
      Powered by <a href="https://github.com/vuenice" target="_blank" rel="noreferrer">VueNice</a>
    </footer>
  </div>
</template>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--vn-color-bg);
  padding: var(--vn-space-5);
}
.auth-shell__card {
  width: min(420px, 100%);
}
.auth-shell__brand {
  display: flex;
  align-items: center;
  gap: var(--vn-space-3);
  margin-bottom: var(--vn-space-5);
}
.auth-shell__logo {
  width: 36px;
  height: 36px;
  border-radius: var(--vn-radius-md);
  background: var(--vn-color-primary);
  color: var(--vn-color-primary-contrast);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-shell__title {
  font-size: 18px;
  margin: 0;
}
.auth-shell__foot {
  margin-top: var(--vn-space-4);
  font-size: 12px;
}
</style>
