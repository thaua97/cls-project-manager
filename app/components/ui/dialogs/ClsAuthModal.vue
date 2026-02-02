<template>
  <UModal
    :open="isOpen"
    :dismissible="false"
    :ui="{
      wrapper: 'flex flex-col items-center justify-center',
      content: 'overflow-visible',
    }"
  >
    <template #content="{ close }">
      <div class="w-full p-6">
        <UAuthForm
          :schema="schema"
          :title="title"
          :description="description"
          icon="i-lucide-user"
          :fields="fields"
          :submit="{ label: submitLabel }"
          @submit="onSubmit"
        >
          <template #footer>
            <div class="w-full flex justify-center">
              <UButton color="neutral" variant="link" @click="toggleMode">
                {{
                  mode === "login"
                    ? "Não tem conta? Criar uma agora"
                    : "Já tem conta? Entrar"
                }}
              </UButton>
            </div>

            <div class="w-full flex justify-center mt-2">
              <UButton color="primary" variant="outline" @click="onGuest">
                Entrar como convidado
              </UButton>
            </div>
          </template>
        </UAuthForm>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
const { isOpen, mode, toggleMode, close: closeModal } = useAuthModal();
const auth = useAuth();

const { title, description, schema, fields, submitLabel } =
  useAuthFormConfig(mode);

const onSubmit = async (payload: any) => {
  const data = payload?.data as any;

  if (mode.value === "login") {
    const result = await auth.login({
      email: String(data.email ?? ""),
      password: String(data.password ?? ""),
    });

    if (result.success) {
      // Modal fecha automaticamente via computed quando isAuthenticated = true
    }

    return;
  }

  const result = await auth.register({
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    password: String(data.password ?? ""),
  });

  if (result.success) {
    mode.value = "login";
  }
};

const onGuest = () => {
  auth.loginAsGuest();
  // Modal fecha automaticamente via computed quando isAuthenticated = true
};
</script>
