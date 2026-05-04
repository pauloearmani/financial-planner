# Financial Planner — Planejador Financeiro

Calculadora de planejamento financeiro pessoal de longo prazo. Genérica e configurável: o usuário define seu perfil e o plano se adapta.

## Stack

- React 18 + Vite
- CSS Modules (sem dependências de UI)
- `localStorage` para persistência de todos os dados

## Setup

```bash
npm install
npm run dev
```

## Estrutura

```
src/
├── hooks/
│   └── useFinancialPlan.js   # Toda a lógica de cálculo + persistência
├── components/
│   ├── ProfileTab.jsx        # Perfil do usuário (idade, patrimônio, carreira)
│   ├── OverviewTab.jsx       # Parâmetros financeiros (renda, taxa, inflação)
│   ├── GoalsTab.jsx          # Metas editáveis + progresso por objetivo
│   ├── ProjectionTab.jsx     # Tabela completa + marcos do caminho
│   ├── Slider.jsx / .module.css
│   ├── GaugeBar.jsx / .module.css
│   └── Tab.module.css        # Estilos compartilhados entre tabs
├── utils/
│   └── formatters.js         # fmt, fmtPct, fmtShort
├── styles/
│   └── global.css            # Variáveis CSS + resets
├── App.jsx
└── App.module.css
```

## Features

### Perfil do usuário
- Idade atual (slider 16–60 anos)
- Patrimônio atual (slider R$ 0–500k)
- Estágio de carreira (Ensino Médio → Empreendedor)
- Área de atuação (Tech, Saúde, Direito, Finanças, Educação, Outro)
- Todos os campos persistem no `localStorage`

### Projeção salarial progressiva
O salário cresce ano a ano com base no estágio de carreira e área:
- Anos 1–3: crescimento acelerado (10–20% ao ano)
- Anos 4–7: crescimento moderado (6–12% ao ano)
- Anos 8–12: crescimento lento (3–6% ao ano)
- Anos 13+: crescimento residual (2–3% ao ano)

Área de atuação aplica um multiplicador: Tech +10%, Direito/Finanças +5%, Educação −5%.

### Inflação realista
- Slider de inflação anual (padrão 5%, range 2–12%)
- Tabela exibe patrimônio nominal e valor real (poder de compra deflacionado)
- Marcos do caminho exibem valor real projetado ao final

### Progresso por meta
Na aba Metas, cada objetivo mostra:
- % já coberto pelo patrimônio atual
- Estimativa de tempo para atingir (anos e meses, com idade)

### Tabela completa ano a ano
Colunas: Ano · Idade · Salário · Aporte anual · Patrimônio Nominal · Valor Real · % da Meta

### UX genérica
- Nomes dos objetivos editáveis inline
- Horizonte de tempo configurável via slider (5–35 anos)
- Título e textos genéricos — sem referências pessoais hardcoded

## Roadmap

- [ ] Gráfico de linha da projeção (recharts ou visx)
- [ ] Exportar plano como PDF
- [ ] Múltiplos cenários (otimista / realista / pessimista)
- [ ] Considerar IR sobre rendimentos (tabela regressiva)
- [ ] Deploy na Vercel
