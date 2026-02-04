# ADR-0003 — Estratégia de Testes do Front-end (Vitest + Cypress)

## Status

Aceita

## Contexto

O front-end `cls-project-manager` implementa o core do produto (listagem, filtros, busca, CRUD, favoritos) e integra com a API via HTTP.

Por ser um desafio avaliado tecnicamente, os testes precisam:

- Cobrir regras e fluxos críticos do core
- Ser rápidos para feedback durante desenvolvimento
- Ser confiáveis para validar integração e regressões de UI

Stack atual já inclui:

- **Vitest** (unit/component)
- **Cypress** (E2E)

Data da decisão: **2026-02-02**

Stakeholders envolvidos:

- Pessoa desenvolvedora (autora do projeto)
- Recrutadores/avaliadores técnicos

## Requisitos e Drivers

### Funcionais

- Validar fluxos do usuário (criar/editar/remover, favoritar, buscar, filtrar, ordenar).
- Validar renderização de componentes e regras de formulário.

### Não funcionais

- **Rapidez**: testes unitários/component devem rodar rapidamente (CI e local).
- **Confiabilidade**: E2E deve ser estável (evitar flaky tests).
- **Custo**: configuração simples, sem infra complexa.
- **Manutenibilidade**: testes fáceis de entender (arrange/act/assert), baixo acoplamento.

## Opções Consideradas

### Opção A — Vitest + Cypress (escolhida)

**Descrição**  
Usar **Vitest** para testes unitários e de componentes (quando aplicável) e **Cypress** para testes ponta-a-ponta dos fluxos do core.

**Prós**

- Vitest é rápido e integrado ao ecossistema Vite/Nuxt.
- Cypress valida o comportamento real do usuário e integração entre telas.
- Bom equilíbrio entre cobertura e custo de manutenção.

**Contras**

- Exige disciplina para separar o que é unit/component vs. o que é E2E.
- E2E tende a ser mais lento e mais sensível a mudanças de UI.

**Riscos**

- Flakiness em E2E se não houver dados previsíveis e sincronização correta.
- Testes podem depender do estado da API (especialmente em ambiente de provider free).

---

### Opção B — Apenas E2E (Cypress)

**Descrição**  
Concentrar a validação apenas em testes ponta-a-ponta.

**Prós**

- Garante cobertura de fluxos reais.

**Contras**

- Feedback mais lento.
- Diagnóstico de falhas mais difícil.
- Maior custo de manutenção.

**Riscos**

- Baixa produtividade por rodadas longas.

---

### Opção C — Apenas unit/component (Vitest)

**Descrição**  
Cobrir somente unidades e componentes, sem simular o fluxo completo.

**Prós**

- Execução rápida.
- Mais fácil isolar casos.

**Contras**

- Não valida integração real entre páginas, roteamento e chamadas HTTP.

**Riscos**

- Regressões de UX passam despercebidas.

---

### Opção D — Playwright ao invés de Cypress

**Descrição**  
Usar Playwright para E2E.

**Prós**

- Ótima performance e ferramentas modernas.

**Contras**

- Mudança de stack e setup adicional.

**Riscos**

- Aumentar o tempo de entrega sem ganho proporcional para o desafio.

## Decisão

Adotar **Vitest** para testes unitários/component e **Cypress** para E2E.

Motivos:

- Cobertura equilibrada do core com feedback rápido (Vitest) e validação real de UX (Cypress).
- A stack já está presente no projeto e reduz custo de adoção.

## Consequências

### Impactos positivos

- Redução de regressões no core.
- Maior confiança para refactor de UI e composables.
- E2E atua como “contrato” de comportamento do usuário.

### Impactos negativos

- Necessidade de manter dados previsíveis para os testes.
- E2E mais lento e mais sensível a mudanças visuais.

### Débitos técnicos assumidos

- Definir uma estratégia de dados de teste (seed/mocks) para evitar instabilidade.
- Padronizar helpers/commands no Cypress para reduzir repetição.

## Trade-offs e Justificativas Técnicas

- **Velocidade vs. cobertura real**: unit/component dá velocidade; E2E dá confiança em fluxos reais.
- **Acoplamento de UI**: E2E acopla à UI; mitigação com seletores estáveis e testes focados em comportamento.

## Alternativas Futuras / Reavaliação

Revisitar esta decisão se:

- O projeto crescer e exigir uma suíte maior de component tests.
- Flakiness de E2E se tornar um problema recorrente.
- For necessário rodar E2E em múltiplos navegadores/ambientes (avaliar Playwright).

## Referências (opcional)

- Vitest: https://vitest.dev/guide/
- Cypress: https://docs.cypress.io/
- Nuxt Testing: https://nuxt.com/docs/getting-started/testing
