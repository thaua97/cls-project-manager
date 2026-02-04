# CLS Project Manager (Front-end)
Front-end em **Nuxt 4** para o desafio **CLS Manager**.

[[Teste em produção]: https://cls-project-manager.onrender.com/](https://cls-project-manager.onrender.com/)

[[API]: https://rs-transaction-api.onrender.com/health](https://rs-transaction-api.onrender.com/health)

> [!WARNING]
> Para testar em produção, acesse primeiro a API e verifique que ela está online.
> Como é um provider free, o serviço pode estar em hibernação.



O app consome a API configurada em `NUXT_PUBLIC_API_BASE_URL` (por padrão `http://localhost:3333`).

## Documentação

- **Rotas/contratos da API**: `docs/api/API_ROUTES_DOCUMENTATION.md`
- **Collection do Insomnia**: `docs/api/insomnia.collection.json`

## ADRs (Architecture Decision Records)

- `docs/adr/0001-nuxt4-frontend-core.md`
- `docs/adr/0002-tailwindcss-nuxt-ui.md`
- `docs/adr/0003-frontend-testing-strategy.md`

## Bibliotecas (docs)

- **Nuxt**: https://nuxt.com/docs
- **Vue**: https://vuejs.org/guide/
- **Nuxt UI**: https://ui.nuxt.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Pinia**: https://pinia.vuejs.org/
- **VueUse**: https://vueuse.org/
- **VeeValidate**: https://vee-validate.logaretm.com/v4/
- **Zod**: https://zod.dev/
- **Axios**: https://axios-http.com/docs/intro
- **Day.js**: https://day.js.org/docs/en/installation/installation
- **Fuse.js** (fuzzy search): https://www.fusejs.io/
- **Cypress** (E2E): https://docs.cypress.io/
- **Vitest** (unit tests): https://vitest.dev/guide/
- **Nuxt Icon**: https://github.com/nuxt/icon
- **Nuxt Image**: https://image.nuxt.com/
- **Nuxt A11y**: https://github.com/nuxt-modules/a11y
- **ESLint (Nuxt ESLint module)**: https://eslint.nuxt.com/

## Requisitos

- Node.js (recomendado LTS)
- Um gerenciador de pacotes (npm/pnpm/yarn/bun)

## Setup

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

O front usa `runtimeConfig.public.apiBaseUrl`.

Você pode configurar via env:

```bash
NUXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

## Rodando o front-end

Servidor de desenvolvimento (default: `http://localhost:3000`):

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

Preview do build de produção:

```bash
npm run preview
```

Rodar o servidor gerado (após `build`):

```bash
npm run prod
```

## Testes

Unit tests (Vitest):

```bash
npm run test
```

Modo watch:

```bash
npm run test:watch
```

E2E (Cypress):

```bash
npm run test:e2e
```

Abrir UI do Cypress:

```bash
npm run test:e2e:open
```
