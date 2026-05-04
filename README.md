# 💰 Financial Planner

Calculadora de planejamento financeiro pessoal de longo prazo.

## Stack

- React 18 + Vite
- CSS Modules (sem dependências de UI)
- `localStorage` para persistência dos dados

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
│   ├── Slider.jsx / .module.css
│   ├── GaugeBar.jsx / .module.css
│   ├── OverviewTab.jsx
│   ├── GoalsTab.jsx
│   ├── ProjectionTab.jsx
│   └── Tab.module.css        # Estilos compartilhados entre tabs
├── utils/
│   └── formatters.js         # fmt, fmtPct, fmtShort
├── styles/
│   └── global.css            # Variáveis CSS + resets
├── App.jsx
└── App.module.css
```

## Roadmap

- [ ] Gráfico de linha da projeção (recharts ou visx)
- [ ] Exportar plano como PDF
- [ ] Suporte a múltiplos cenários (otimista / realista / pessimista)
- [ ] Ajuste de inflação
- [ ] Deploy na Vercel
