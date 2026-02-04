<template>
  <div v-if="isOpen" data-testid="auth-modal">
    <UModal
      :open="isOpen"
      :dismissible="false"
      :ui="{
        wrapper: 'flex flex-col items-center justify-center',
        content: 'overflow-visible',
        overlay: 'bg-primary/70',
      }"
    >
      <template #content="{ close }">
        <div
          class="w-full flex flex-col items-center gap-6 p-6"
          data-testid="auth-modal-content"
        >
          <ClsLogo color="primary" />
          <div v-if="errorMessage" class="w-full" data-testid="auth-error">
            <UAlert
              class="w-full"
              color="error"
              variant="subtle"
              title="Heads up!"
              :description="errorMessage"
              icon="i-lucide-terminal"
            />
          </div>
          <UAuthForm
            v-if="canUseCredentials"
            :schema="schema"
            :title="title"
            :description="description"
            :fields="fields"
            @submit="onSubmit"
          >
            <template #submit>
              <UButton
                type="submit"
                data-testid="auth-submit-button"
                class="w-full h-10 flex items-center justify-center rounded-full px-6"
                color="primary"
                variant="solid"
              >
                {{ submitLabel }}
              </UButton>
            </template>
            <template #footer>
              <div class="w-full flex justify-center">
                <UButton
                  type="button"
                  color="primary"
                  variant="link"
                  data-testid="auth-toggle-mode"
                  @click="toggleMode"
                >
                  {{
                    mode === "login"
                      ? "Não tem conta? Criar uma agora"
                      : "Já tem conta? Entrar"
                  }}
                </UButton>
              </div>
            </template>
          </UAuthForm>
          <UAlert
            v-else
            class="w-full"
            color="error"
            variant="subtle"
            title="Chamem um dev!"
            :description="'Não foi possível conectar ao servidor'"
            icon="i-lucide-activity"
          />

          <div class="w-full flex justify-center">
            <UButton
              color="primary"
              variant="outline"
              class="rounded-full px-6"
              data-testid="auth-guest-button"
              @click="onGuest"
            >
              Entrar como convidado
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
const { isOpen, mode, toggleMode, close } = useAuthModal();
const auth = useAuth();

const errorMessage = ref("");
const canUseCredentials = computed(() => auth.canUseCredentials.value);

const { title, description, schema, fields, submitLabel } =
  useAuthFormConfig(mode);

watch(
  isOpen,
  (open) => {
    if (!open) {
      return;
    }
    errorMessage.value = "";
    auth.checkHealth();
  },
  { immediate: true },
);

type AuthFormPayload = {
  data?: Record<string, unknown>;
};

const onSubmit = async (payload: AuthFormPayload) => {
  const data = payload.data ?? {};

  if (mode.value === "login") {
    const result = await auth.login({
      email: String(data.email ?? ""),
      password: String(data.password ?? ""),
    });

    if (result.success) {
      errorMessage.value = "";
      // Modal fecha automaticamente via computed quando isAuthenticated = true
    } else {
      errorMessage.value = result.error;
    }

    return;
  }

  const result = await auth.register({
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    password: String(data.password ?? ""),
  });

  if (result.success) {
    errorMessage.value = "";
    mode.value = "login";
  } else {
    errorMessage.value = result.error;
  }
};

const onGuest = () => {
  auth.loginAsGuest();
  // Modal fecha automaticamente via computed quando isAuthenticated = true
};
</script>
