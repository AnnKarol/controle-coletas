# Controle de Coletas — EcoColeta

Aplicação web para cadastrar coletas de resíduos e acompanhá-las em um painel com a identidade visual da KL GAMA. Feita como desafio técnico do processo seletivo de estágio em desenvolvimento fullstack da KL GAMA.

**Projeto publicado:** https://annkarol.github.io/controle-coletas/

> Dica: com a lista vazia, clique em **"Carregar dados de exemplo"** para preencher o sistema com coletas fictícias e ver o painel funcionando.

## Tecnologias

- **Vue 3** (Composition API com `<script setup>`) + **Quasar 2**, a mesma base de front-end da KL GAMA
- **TypeScript**
- **Pinia** para guardar o estado das coletas
- **localStorage** para manter os dados depois de recarregar a página
- **Vitest** para os testes automatizados
- **GitHub Actions** + **GitHub Pages** para publicar o site

O gráfico e as barras do painel foram desenhados com HTML e CSS, sem biblioteca de gráficos.

## Como rodar o projeto do zero

Pré-requisitos: **Node.js 22.12 ou mais novo** (testado com o 24) e **Git**.

```bash
# 1. Baixar o projeto
git clone https://github.com/AnnKarol/controle-coletas.git
cd controle-coletas

# 2. Instalar as dependências
npm install

# 3. Rodar em modo de desenvolvimento (abre em http://localhost:9000)
npm run dev
```

Não é preciso configurar nada: não há variáveis de ambiente nem banco de dados. Os dados ficam no `localStorage` do navegador.

### Outros comandos

| Comando              | O que faz                                           |
| -------------------- | --------------------------------------------------- |
| `npm test`           | Roda os testes automatizados                        |
| `npm run typecheck`  | Confere os tipos do TypeScript                      |
| `npm run lint:check` | Confere a formatação (Prettier) e o código (ESLint) |
| `npm run build`      | Gera a versão de produção em `dist/spa`             |

## Estrutura

```
src/
├── types/coleta.ts            # modelo de dados (tipos e listas fixas)
├── stores/coletas-store.ts    # Pinia: lista de coletas, cadastrar, editar, excluir e salvar no localStorage
├── utils/
│   ├── validacao.ts           # regras de validação do formulário
│   ├── filtros.ts             # filtros da lista e busca por cliente
│   ├── painel.ts              # contas do painel (indicadores, meses, composição, atrasadas)
│   ├── formatacao.ts          # datas, kg, toneladas e percentuais no formato brasileiro
│   ├── csv.ts                 # geração do CSV
│   └── dados-exemplo.ts       # coletas fictícias para demonstração
├── components/
│   ├── ColetaFormDialog.vue   # formulário de cadastro e edição
│   └── painel/                # cartão de indicador, composição por resíduo e gráfico mensal
├── pages/
│   ├── ColetasPage.vue        # lista, filtros, cadastro, edição e exclusão
│   └── PainelPage.vue         # painel
└── css/                       # paleta da KL GAMA e estilos globais
```

As regras e as contas ficam em `utils/`, separadas das telas, para poder testar sem abrir o navegador.

## Requisitos obrigatórios

- [x] 1. Cadastrar uma coleta com todos os campos do modelo de dados
- [x] 2. Validar os campos e mostrar a mensagem de erro junto ao campo inválido
- [x] 3. Listar as coletas em uma tabela, da mais recente para a mais antiga
- [x] 4. Editar e excluir, com confirmação antes de excluir
- [x] 5. Filtrar a lista por status e por tipo de resíduo
- [x] 6. Tela de Painel com os quatro cartões, o gráfico mensal e a composição por resíduo
- [x] 7. Dados mantidos depois de recarregar a página (localStorage)
- [x] 8. README com o passo a passo para rodar

## Diferenciais entregues

- [x] Filtro de período (mês inicial e final) que atualiza todo o painel
- [x] Cartão escuro "Precisa de atenção" com as coletas agendadas cuja data já passou
- [x] Busca por nome do cliente, combinada com os filtros (ignora maiúsculas e acentos)
- [x] Layout responsivo: no celular a tabela vira uma lista de cartões
- [x] Exportar a lista filtrada em CSV (separado por `;` para abrir direto no Excel)
- [x] 13 testes automatizados (validações e contas do painel)
- [x] Projeto publicado online no GitHub Pages
- [x] Commits pequenos, com mensagens claras
- [ ] Back-end próprio com banco de dados (não entregue; veja "Com mais tempo")

## Suposições

Onde o enunciado deixava espaço para interpretação, decidi assim:

- **Peso destinado, gráfico mensal e composição por resíduo** consideram só as coletas **Realizadas**, porque só elas foram de fato destinadas.
- **Percentual de realizadas** é calculado sobre o total de coletas, incluindo as canceladas.
- **Agendadas** conta todas as coletas com esse status, com data passada ou futura. O selo "atenção" aparece quando há pelo menos uma.
- **Data futura** só é bloqueada quando o status é Realizada. Agendada e Cancelada aceitam qualquer data.
- **Gráfico mensal:** meses sem coleta entre o primeiro e o último aparecem com zero, para o gráfico não pular meses.
- **Filtro de período** usa o mês da data da coleta e vale só para o painel. A lista tem os próprios filtros.
- **Dados:** como não há back-end, cada navegador tem a sua própria lista de coletas. Os dados de exemplo são fictícios.

## Com mais tempo, eu faria

- **Back-end** em NestJS com PostgreSQL e TypeORM, a mesma stack da KL GAMA, no lugar do localStorage, e o projeto rodando com Docker.
- **Testes dos componentes** de tela, além dos testes das regras.
- **Busca e filtros guardados no endereço da página**, para poder compartilhar uma lista já filtrada.

**Melhoria que eu proporia para o painel de referência:** deixar o gráfico mensal clicável. Ao clicar na barra de um mês, o painel inteiro filtraria por aquele mês. E os cartões do topo mostrariam a comparação com o período anterior (por exemplo, "+12% em relação ao mês passado"), para ficar claro se os números estão melhorando ou piorando.

## Tempo dedicado

Aproximadamente **8 horas**, divididas em três dias.

## Uso de IA

Usei o Claude (IA da Anthropic) como apoio durante o desenvolvimento, como o desafio permite. O código foi conferido com os testes automatizados, a verificação de tipos, o lint e testes manuais no navegador.
