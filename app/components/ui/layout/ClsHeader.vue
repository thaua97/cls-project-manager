<template>
  <div>
    <header
      class="h-[80px] bg-primary-900 text-white flex items-center justify-between px-4 shadow-lg"
    >
      <img src="/img/logo.svg" alt="Logo" class="h-12" />

      <div class="flex items-center gap-2">
        <template v-if="isAuthenticated">
          <UButton color="neutral" variant="subtle" @click="logout">
            Sair
          </UButton>
        </template>
        <template v-else>
          <UButton color="neutral" variant="subtle" @click="openLogin">
            Entrar
          </UButton>
          <UButton color="primary" variant="solid" @click="openRegister">
            Criar conta
          </UButton>
        </template>
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
const { openLogin, openRegister } = useAuthModal();
const auth = useAuth();

const isAuthenticated = auth.isAuthenticated;
const logout = () => {
  auth.logout();
};
</script>
