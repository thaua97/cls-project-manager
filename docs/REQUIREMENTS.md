# Requisitos do Sistema - Gerenciador de Projetos

## 1. Casos de Uso

### UC01 - Visualizar Listagem de Projetos
**Ator:** Usuário  
**Descrição:** O usuário acessa a página principal para visualizar todos os projetos cadastrados.  
**Pré-condições:** Usuário autenticado no sistema.  
**Fluxo Principal:**
1. Usuário acessa a página principal
2. Sistema exibe o título da página
3. Sistema exibe o total de projetos cadastrados
4. Sistema exibe a listagem de projetos ordenada alfabeticamente (padrão)
5. Caso não existam projetos, sistema exibe tela vazia conforme design

**Pós-condições:** Listagem de projetos é exibida corretamente.

---

### UC02 - Filtrar Projetos Favoritos
**Ator:** Usuário  
**Descrição:** O usuário filtra a listagem para exibir apenas projetos marcados como favoritos.  
**Pré-condições:** Usuário na página de listagem de projetos.  
**Fluxo Principal:**
1. Usuário ativa o filtro de favoritos
2. Sistema filtra e exibe apenas projetos marcados como favoritos
3. Sistema mantém a ordenação atual aplicada

**Fluxo Alternativo:**
- Se não houver projetos favoritos, sistema exibe mensagem informativa

**Pós-condições:** Apenas projetos favoritos são exibidos.

---

### UC03 - Ordenar Listagem de Projetos
**Ator:** Usuário  
**Descrição:** O usuário ordena a listagem de projetos segundo diferentes critérios.  
**Pré-condições:** Usuário na página de listagem com projetos cadastrados.  
**Fluxo Principal:**
1. Usuário seleciona critério de ordenação
2. Sistema reordena a listagem conforme critério escolhido:
   - Ordem alfabética (A-Z)
   - Projetos iniciados mais recentemente
   - Projetos próximos à data de finalização

**Pós-condições:** Listagem é reordenada conforme critério selecionado.

---

### UC04 - Buscar Projetos
**Ator:** Usuário  
**Descrição:** O usuário busca projetos digitando termos na barra de busca.  
**Pré-condições:** Usuário na página de listagem.  
**Fluxo Principal:**
1. Usuário digita ao menos 3 caracteres na barra de busca
2. Sistema dispara a busca automaticamente
3. Sistema filtra e exibe projetos que correspondem ao termo buscado
4. Sistema salva a busca no histórico (opcional)
5. Sistema destaca (highlight) os termos encontrados nos resultados (opcional)

**Fluxo Alternativo:**
- Se usuário digitar menos de 3 caracteres, sistema não dispara busca

**Pós-condições:** Resultados da busca são exibidos.

---

### UC05 - Visualizar Histórico de Buscas (Opcional)
**Ator:** Usuário  
**Descrição:** O usuário visualiza e reutiliza buscas recentes.  
**Pré-condições:** Usuário já realizou buscas anteriormente.  
**Fluxo Principal:**
1. Usuário clica/foca na barra de busca
2. Sistema exibe as últimas 5 buscas realizadas
3. Usuário seleciona uma busca do histórico
4. Sistema executa a busca selecionada

**Pós-condições:** Busca anterior é reexecutada.

---

### UC06 - Criar Novo Projeto
**Ator:** Usuário  
**Descrição:** O usuário cria um novo projeto no sistema.  
**Pré-condições:** Usuário autenticado.  
**Fluxo Principal:**
1. Usuário clica em "Novo Projeto"
2. Sistema exibe página com formulário de criação
3. Usuário preenche os dados do projeto
4. Usuário submete o formulário
5. Sistema valida os dados
6. Sistema salva o novo projeto
7. Sistema redireciona para a listagem
8. Sistema exibe mensagem de sucesso

**Fluxo Alternativo:**
- Se dados inválidos, sistema exibe mensagens de erro nos campos

**Pós-condições:** Novo projeto é criado e exibido na listagem.

---

### UC07 - Editar Projeto
**Ator:** Usuário  
**Descrição:** O usuário edita informações de um projeto existente.  
**Pré-condições:** Projeto existe no sistema.  
**Fluxo Principal:**
1. Usuário seleciona opção de editar projeto
2. Sistema exibe página com formulário de edição preenchido
3. Usuário modifica os dados desejados
4. Usuário submete o formulário
5. Sistema valida os dados
6. Sistema atualiza o projeto
7. Sistema redireciona para a listagem
8. Sistema exibe mensagem de sucesso

**Fluxo Alternativo:**
- Se dados inválidos, sistema exibe mensagens de erro nos campos

**Pós-condições:** Projeto é atualizado com as novas informações.

---

### UC08 - Remover Projeto
**Ator:** Usuário  
**Descrição:** O usuário remove um projeto do sistema.  
**Pré-condições:** Projeto existe no sistema.  
**Fluxo Principal:**
1. Usuário seleciona opção de remover projeto
2. Sistema exibe modal de confirmação
3. Usuário confirma a remoção
4. Sistema remove o projeto
5. Sistema atualiza a listagem
6. Sistema exibe mensagem de sucesso

**Fluxo Alternativo:**
- Se usuário cancelar, sistema fecha modal sem remover

**Pós-condições:** Projeto é removido do sistema.

---

### UC09 - Favoritar/Desfavoritar Projeto
**Ator:** Usuário  
**Descrição:** O usuário marca ou desmarca um projeto como favorito.  
**Pré-condições:** Projeto existe no sistema.  
**Fluxo Principal:**
1. Usuário clica no ícone de favorito do projeto
2. Sistema alterna o estado de favorito
3. Sistema atualiza visualmente o ícone
4. Sistema persiste a alteração

**Pós-condições:** Estado de favorito do projeto é atualizado.

---

## 2. Requisitos Funcionais

### RF01 - Listagem de Projetos
**Prioridade:** Alta  
**Descrição:** O sistema deve exibir uma listagem de todos os projetos cadastrados.
- Deve exibir tela vazia conforme design quando não houver projetos
- Deve exibir o título da página
- Deve exibir o total de projetos cadastrados
- Ordenação padrão: alfabética (A-Z)

---

### RF02 - Contador de Projetos
**Prioridade:** Alta  
**Descrição:** O sistema deve exibir o número total de projetos cadastrados na listagem atual (considerando filtros aplicados).

---

### RF03 - Filtro de Favoritos
**Prioridade:** Alta  
**Descrição:** O sistema deve permitir filtrar a listagem para exibir apenas projetos marcados como favoritos.
- Filtro deve ser toggle (ativar/desativar)
- Deve manter a ordenação aplicada

---

### RF04 - Ordenação de Projetos
**Prioridade:** Alta  
**Descrição:** O sistema deve permitir ordenar a listagem por:
- **Ordem alfabética (A-Z)** - padrão
- **Data de início** - projetos mais recentes primeiro
- **Data de finalização** - projetos com prazo mais próximo primeiro

---

### RF05 - Criação de Projeto
**Prioridade:** Alta  
**Descrição:** O sistema deve fornecer uma página com formulário para criação de novos projetos.
- Deve validar campos obrigatórios
- Deve exibir mensagens de erro específicas por campo
- Deve redirecionar para listagem após sucesso

---

### RF06 - Edição de Projeto
**Prioridade:** Alta  
**Descrição:** O sistema deve fornecer uma página com formulário para edição de projetos existentes.
- Deve carregar dados atuais do projeto
- Deve validar campos obrigatórios
- Deve exibir mensagens de erro específicas por campo
- Deve redirecionar para listagem após sucesso

---

### RF07 - Remoção de Projeto
**Prioridade:** Alta  
**Descrição:** O sistema deve permitir remover projetos com confirmação.
- Deve exibir modal de confirmação antes de remover
- Deve permitir cancelar a operação
- Deve atualizar listagem após remoção

---

### RF08 - Favoritar Projeto
**Prioridade:** Média  
**Descrição:** O sistema deve permitir marcar/desmarcar projetos como favoritos.
- Ação deve ser rápida (sem reload de página)
- Deve atualizar visualmente o estado imediatamente
- Deve persistir o estado no banco de dados

---

### RF09 - Busca de Projetos
**Prioridade:** Alta  
**Descrição:** O sistema deve fornecer barra de busca para filtrar projetos.
- Busca deve ser disparada após digitação de 3 ou mais caracteres
- Deve buscar em campos relevantes (nome, descrição, etc.)
- Deve atualizar resultados em tempo real

---

### RF10 - Histórico de Buscas (Opcional)
**Prioridade:** Baixa  
**Descrição:** O sistema deve armazenar e exibir as últimas 5 buscas realizadas.
- Deve exibir histórico ao focar na barra de busca
- Deve permitir selecionar busca anterior para reexecutar
- Deve manter histórico por sessão ou persistido

---

### RF11 - Highlight de Resultados (Opcional)
**Prioridade:** Baixa  
**Descrição:** O sistema deve destacar visualmente os termos buscados nos resultados.
- Deve aplicar estilo diferenciado aos termos encontrados
- Deve funcionar em múltiplos campos do resultado

---

## 3. Requisitos Não-Funcionais

### RNF01 - Usabilidade
**Categoria:** Usabilidade  
**Descrição:** A interface deve seguir o design fornecido e ser intuitiva.
- Feedback visual imediato para ações do usuário
- Mensagens de erro claras e específicas
- Navegação consistente entre páginas

---

### RNF02 - Performance
**Categoria:** Performance  
**Descrição:** O sistema deve responder rapidamente às ações do usuário.
- Listagem deve carregar em menos de 2 segundos
- Busca deve retornar resultados em menos de 500ms
- Ações de favoritar devem ser instantâneas (< 200ms)

---

### RNF03 - Responsividade
**Categoria:** Interface  
**Descrição:** A interface deve ser responsiva e funcionar em diferentes tamanhos de tela.
- Suporte a desktop (1920x1080 e superiores)
- Suporte a tablets (768px - 1024px)
- Suporte a mobile (320px - 767px)

---

### RNF04 - Acessibilidade
**Categoria:** Acessibilidade  
**Descrição:** O sistema deve seguir padrões de acessibilidade web.
- Suporte a navegação por teclado
- Uso adequado de atributos ARIA
- Contraste adequado de cores (WCAG 2.1 AA)

---

### RNF05 - Compatibilidade
**Categoria:** Compatibilidade  
**Descrição:** O sistema deve funcionar nos principais navegadores.
- Chrome (últimas 2 versões)
- Firefox (últimas 2 versões)
- Safari (últimas 2 versões)
- Edge (últimas 2 versões)

---

### RNF06 - Persistência de Dados
**Categoria:** Dados  
**Descrição:** Os dados devem ser persistidos de forma confiável.
- Uso de banco de dados ou localStorage conforme arquitetura
- Validação de integridade dos dados
- Tratamento de erros de persistência

---

### RNF07 - Validação de Formulários
**Categoria:** Segurança/Qualidade  
**Descrição:** Formulários devem ter validação client-side e server-side.
- Validação em tempo real (client-side)
- Validação final no backend (server-side)
- Sanitização de inputs para prevenir XSS

---

### RNF08 - Feedback Visual
**Categoria:** Usabilidade  
**Descrição:** O sistema deve fornecer feedback visual para todas as ações.
- Loading states durante operações assíncronas
- Mensagens de sucesso/erro após operações
- Estados visuais para elementos interativos (hover, active, disabled)

---

### RNF09 - Manutenibilidade
**Categoria:** Qualidade de Código  
**Descrição:** O código deve ser organizado e de fácil manutenção.
- Componentização adequada
- Separação de responsabilidades
- Código documentado quando necessário
- Uso de TypeScript para type safety

---

### RNF10 - Escalabilidade
**Categoria:** Performance  
**Descrição:** O sistema deve suportar crescimento no volume de dados.
- Paginação ou virtualização para listas grandes (> 100 itens)
- Otimização de queries e filtros
- Lazy loading de recursos quando apropriado

---

## 4. Regras de Negócio

### RN01 - Busca Mínima
A busca só deve ser disparada após o usuário digitar ao menos 3 caracteres.

### RN02 - Ordenação Padrão
A ordenação padrão da listagem deve ser alfabética (A-Z).

### RN03 - Confirmação de Remoção
A remoção de projetos deve sempre exibir modal de confirmação para evitar exclusões acidentais.

### RN04 - Histórico de Buscas
O histórico deve armazenar no máximo 5 buscas recentes (FIFO - First In, First Out).

### RN05 - Contador Dinâmico
O contador de projetos deve refletir o total de projetos visíveis após aplicação de filtros.

---

## 5. Matriz de Rastreabilidade

| Caso de Uso | Requisitos Funcionais | Requisitos Não-Funcionais |
|-------------|----------------------|---------------------------|
| UC01 | RF01, RF02 | RNF01, RNF02, RNF03 |
| UC02 | RF03 | RNF02, RNF08 |
| UC03 | RF04 | RNF02, RNF08 |
| UC04 | RF09 | RNF02, RNF08 |
| UC05 | RF10 | RNF02, RNF06 |
| UC06 | RF05 | RNF01, RNF07, RNF08 |
| UC07 | RF06 | RNF01, RNF07, RNF08 |
| UC08 | RF07 | RNF01, RNF08 |
| UC09 | RF08 | RNF02, RNF06, RNF08 |
