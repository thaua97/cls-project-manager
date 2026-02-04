# ADR-0001 — Adotar Nuxt 4 como stack do Front-end (escopo core)

## Status

Aceita

## Contexto

O projeto **CLS Project Manager (Front-end)** (`cls-project-manager`) implementa a camada de UI do desafio **Gerenciador de Projetos**, cobrindo o escopo “core” definido em `docs/REQUIREMENTS.md`:

- Listagem de projetos, contador e estado vazio
- Filtro de favoritos
- Ordenação
- Busca (mínimo 3 caracteres)
- CRUD (criar/editar/remover) com validação de formulário
- Favoritar/desfavoritar
- Integração com a API (HTTP) e feedback visual (loading/sucesso/erro)

Contexto técnico atual:

- Framework: **Nuxt 4** (Vue 3)
- UI: **@nuxt/ui** + Tailwind
- Estado: **Pinia**
- Validação: **vee-validate** + **zod**
- Testes: **Vitest** e **Cypress**
- Configuração de API via `runtimeConfig.public.apiBaseUrl` (env `NUXT_PUBLIC_API_BASE_URL`)

ADRs relacionadas:

- ADR-0002 — UI/Estilos (TailwindCSS + Nuxt UI): `docs/adr/0002-tailwindcss-nuxt-ui.md`
- ADR-0003 — Estratégia de Testes (Vitest + Cypress): `docs/adr/0003-frontend-testing-strategy.md`

Restrições organizacionais e de negócio:

- A stack/vaga exige **Nuxt**; por isso a implementação foi feita com Nuxt mesmo havendo domínio prévio de **React** e **Angular** (além de Vue).
- Time-to-market curto (desafio), porém com expectativas de boas práticas e testabilidade.

Premissas (por ausência de informações adicionais):

- O front-end precisa ser de fácil avaliação (estrutura convencional, previsível e alinhada ao ecossistema Nuxt).

Data da decisão: **2026-02-02**

Stakeholders envolvidos:

- Pessoa desenvolvedora (autora do projeto)
- Recrutadores/avaliadores técnicos da vaga

## Requisitos e Drivers

### Funcionais

- Implementar os casos de uso e requisitos funcionais descritos em `docs/REQUIREMENTS.md`.
- Consumir API HTTP configurável por ambiente.
- Exibir feedbacks de carregamento/erro/sucesso e manter a UI responsiva.

### Não funcionais

- **Aderência à stack**: uso de Nuxt conforme exigência.
- **Manutenibilidade**: organização clara (pages orquestrando fluxo; componentes de UI puros; composables para regras e integração).
- **Testabilidade**: testes unitários (Vitest) e E2E (Cypress) cobrindo o core.
- **Performance**: evitar requisições duplicadas e manter UX fluida (especialmente busca/filtragem).
- **Acessibilidade**: suporte básico com `@nuxt/a11y`.
- **Time-to-market**: entregar o core rapidamente com boa UX.

## Opções Consideradas

### Opção A — Nuxt 4 (Vue 3) com SSR/CSR híbrido (escolhida)

**Descrição**  
Usar Nuxt 4 como framework principal, aproveitando convenções (routing por `pages`, `useFetch/useAsyncData`, `runtimeConfig`), módulos oficiais e ecossistema Vue.

**Prós**

- Atende diretamente a restrição de **stack exigida (Nuxt)**.
- Convenções fortes reduzem decisões repetidas (rotas, layouts, configuração, build).
- Melhor ergonomia para SSR/CSR quando necessário (mesmo que o core seja majoritariamente CSR).
- Integrações maduras via módulos (UI, a11y, icon, image).
- Curva de aprendizado menor (Vue) que React/Angular.

**Contras**

- Overhead de framework se o app fosse apenas SPA simples.
- Curva de aprendizado do “jeito Nuxt” (quando comparado a Vite SPA puro).
- Possíveis diferenças de comportamento entre SSR e CSR exigem disciplina (ex.: código que depende de `window`).

**Riscos**

- Usar SSR sem necessidade pode aumentar complexidade operacional.
- Time precisa entender sobre TypeScript.
- Se o time não seguir separação page/component/composable, pode haver acoplamento e duplicação de fetch.

---

### Opção B — Vue 3 SPA com Vite (sem Nuxt)

**Descrição**  
Implementar o front apenas com Vue 3 + Vite + Vue Router, mantendo o escopo estritamente SPA.

**Prós**

- Menos abstração e mais controle direto.
- Build simples e rápido.
- Ideal para apps 100% client-side.

**Contras**

- Não atende a exigência explícita de stack (Nuxt).
- Maior esforço para montar convenções e integração de módulos equivalentes.

**Riscos**

- Divergência do que avaliadores esperam (Nuxt).

---

### Opção C — React (ex.: Next.js ou Vite + React)

**Descrição**  
Usar React por domínio prévio, com Next.js (SSR) ou Vite (SPA).

**Prós**

- Comunidade ampla e robusta.
- Ecossistema amplo com diversas libs.
- Alta produtividade por familiaridade.
- Alta integração com IAs.

**Contras**

- Não atende a exigência de stack (Nuxt).
- A escolha pode ser vista como desalinhamento com o objetivo da vaga.

**Riscos**

- Redução da aderência ao critério de avaliação.

---

### Opção D — Angular

**Descrição**  
Usar Angular por domínio prévio.

**Prós**

- Estrutura opinativa e robusta.
- Boas práticas embutidas (DI, módulos, patterns).

**Contras**

- Não atende a exigência de stack (Nuxt).
- Overhead para o escopo do desafio.

**Riscos**

- Aumentar o tempo de entrega e desalinhamento com avaliação.

## Decisão

Escolhemos a **Opção A — Nuxt 4**.

Justificativa:

- A decisão é dirigida pela restrição externa (**stack/vaga exige Nuxt**).
- Nuxt 4 oferece uma base consistente para entregar o core do desafio com boas práticas de organização e integração.
- Mesmo dominando React e Angular, optar por Nuxt maximiza aderência ao objetivo de avaliação e reduz riscos de desalinhamento.

## Consequências

### Impactos positivos

- Aderência total à stack esperada.
- Estrutura previsível (pages/layouts/components/composables) e boa DX.
- Facilidade de configurar ambientes via `runtimeConfig`.
- Testabilidade e qualidade sustentadas por Vitest/Cypress.

### Impactos negativos

- Parte do potencial de SSR/SEO pode não ser essencial para o core (app interno/CRUD).
- Mais “moving parts” (módulos Nuxt, convenções) do que uma SPA mínima.

### Débitos técnicos assumidos

- Necessidade de manter disciplina SSR-safe quando usar `useFetch/useAsyncData`.

## Trade-offs e Justificativas Técnicas

- **Trade-off: aderência à vaga vs. preferência pessoal**  
  A stack Nuxt foi priorizada por ser critério de avaliação, mesmo com domínio de React/Angular.

- **Trade-off: simplicidade (SPA) vs. convenções (Nuxt)**  
  Foi aceito um pouco mais de framework para obter convenções e consistência.

- **Trade-off: SSR potencial vs. complexidade**  
  O projeto pode operar majoritariamente em CSR, mas manter Nuxt abre espaço para SSR/otimizações sem reescrita.

## Alternativas Futuras / Reavaliação

Revisitar esta decisão se:

- O requisito de stack mudar (ex.: produto migrar para React/Angular) e houver benefício claro.
- O escopo evoluir para necessidades específicas de SEO/SSR (fortalecer SSR) ou, ao contrário, ficar estritamente SPA (avaliar simplificação).
- A dependência de módulos/UI impedir evolução (avaliar substituição de Nuxt UI/Tailwind ou component library).
- O design exigir um design system mais rígido (avaliar tokens próprios + biblioteca alternativa).

## Implementacoes Futuras

- **Onboarding guiado (Product tour)**: apresentar filtros/ordenação/favoritos para reduzir tempo até o primeiro valor.
- **Estados de carregamento refinados**: skeletons na listagem, “saving state” no form e feedback granular por ação.
- **Optimistic UI + Undo**: favoritar/desfavoritar e remover com “desfazer” (reduz fricção e medo de erro).
- **Paginação/virtualização**: suportar listas grandes com performance (ex.: virtual list acima de 100 itens).
- **Histórico de busca + sugestões**: persistir últimas buscas (até 5) e sugerir termos; opcional highlight do termo.
- **Views salvas**: salvar combinações de filtros/ordenação (ex.: “Favoritos”, “Próximos a vencer”).
- **Acessibilidade avançada**: navegação por teclado completa, foco visível, ARIA revisado e testes a11y automatizados.
- **Personalização**: modo escuro, preferências de ordenação padrão e densidade da listagem (compacta/confortável).
- **Estados vazios acionáveis**: empty state com CTA (“Criar projeto”) e exemplos (melhora conversão e clareza).
- **Telemetria de UX (opcional)**: medir tempo de carregamento, erros e funis (ex.: criação de projeto) para iterar produto.

## Referências (opcional)

- Nuxt: https://nuxt.com/docs
- Vue: https://vuejs.org/guide/
- Nuxt UI: https://ui.nuxt.com/
- Tailwind CSS: https://tailwindcss.com/docs
- Pinia: https://pinia.vuejs.org/
- Vitest: https://vitest.dev/guide/
- Cypress: https://docs.cypress.io/
