# ADR-0002 — Adotar TailwindCSS + Nuxt UI para UI/Estilos no Front-end

## Status

Aceita

## Contexto

O front-end `cls-project-manager` precisa entregar o escopo core do produto (listagem, filtros, busca, CRUD, favoritos) com:

- Consistência visual
- Boa UX (feedbacks, estados de loading/erro)
- Baixo tempo de entrega (time-to-market)
- Aderência ao ecossistema Nuxt

O projeto já utiliza Nuxt 4 e precisa de uma abordagem de estilos e componentização que seja rápida, previsível e fácil de manter.

Restrições e premissas:

- O desafio prioriza execução e clareza (UI precisa ser facilmente avaliável).
- O time é pequeno (premissa) e não há um design system completo formalizado.

Data da decisão: **2026-02-02**

Stakeholders envolvidos:

- Pessoa desenvolvedora (autora do projeto)
- Recrutadores/avaliadores técnicos

## Requisitos e Drivers

### Funcionais

- Entregar componentes de UI do core (cards, formulários, modais, filtros, inputs, feedbacks).
- Permitir evolução rápida do layout conforme ajustes de produto.

### Não funcionais

- **Manutenibilidade**: estilos consistentes e com baixo retrabalho.
- **Acessibilidade**: componentes com suporte a teclado/ARIA quando aplicável.
- **Performance**: CSS enxuto e sem dependências pesadas desnecessárias.
- **Produtividade**: reduzir tempo de implementação de UI.
- **Custo de mudança**: facilitar ajustes visuais sem reescrever componentes.

## Opções Consideradas

### Opção A — TailwindCSS + Nuxt UI (escolhida)

**Descrição**  
Usar **TailwindCSS** para composição de estilos utilitários e **Nuxt UI** como biblioteca de componentes para acelerar entrega e padronizar UI.

**Prós**

- Acelera entrega do escopo core com componentes prontos.
- Consistência visual via padrões e variants.
- Boa DX e integração nativa com Nuxt.
- Tailwind facilita ajustes rápidos sem criar CSS bespoke.

**Contras**

- Dependência de biblioteca (Nuxt UI) aumenta custo de migração.
- Tailwind pode reduzir legibilidade sem convenções (classes longas).

**Riscos**

- Customizações profundas podem exigir tempo.
- Inconsistência se cada componente aplicar utilitários sem padrão.

---

### Opção B — CSS Modules/SCSS + componentes próprios

**Descrição**  
Criar componentes e estilos do zero com CSS Modules/SCSS.

**Prós**

- Controle total do HTML/CSS e do design.
- Menor dependência de libs de UI.

**Contras**

- Aumenta o tempo de entrega e manutenção.
- Maior risco de inconsistência visual sem design system.

**Riscos**

- Escopo core pode atrasar por esforço de UI.

---

### Opção C — Biblioteca alternativa (ex.: Vuetify/PrimeVue)

**Descrição**  
Adotar uma biblioteca de componentes Vue diferente.

**Prós**

- Ampla variedade de componentes.

**Contras**

- Pode divergir do design esperado.
- Integração e customização podem ser mais pesadas.

**Riscos**

- Alto custo para “fit” no layout e padrões do desafio.

## Decisão

Adotar **TailwindCSS + Nuxt UI**.

Motivos:

- Maximiza velocidade de entrega e consistência visual no core.
- Mantém aderência ao ecossistema Nuxt.
- Reduz custo de manutenção de CSS e acelera iteração de produto.

## Consequências

### Impactos positivos

- UI consistente e rápida de implementar.
- Melhor base para estados (loading/empty/error) e feedbacks.
- Menos CSS custom e menor chance de regressões visuais.

### Impactos negativos

- Dependência de Nuxt UI e do modelo mental do Tailwind.
- Possível refactor se a biblioteca não atender futuras necessidades.

### Débitos técnicos assumidos

- Definir convenções de Tailwind (ex.: preferir classes semânticas via components quando repetir muito).
- Padronizar tokens/cores/spacing para evitar divergência visual.

## Trade-offs e Justificativas Técnicas

- **Velocidade vs. controle total**: aceitamos limites de customização em troca de entrega e consistência.
- **Dependência vs. produtividade**: dependemos de Nuxt UI para reduzir custo de implementação.

## Alternativas Futuras / Reavaliação

Revisitar esta decisão se:

- O design exigir um design system próprio mais rígido.
- A necessidade de componentes avançados crescer além do que Nuxt UI oferece.
- Custos de customização/migração superarem o ganho de produtividade.

## Referências (opcional)

- Tailwind CSS: https://tailwindcss.com/docs
- Nuxt UI: https://ui.nuxt.com/
- Nuxt: https://nuxt.com/docs
