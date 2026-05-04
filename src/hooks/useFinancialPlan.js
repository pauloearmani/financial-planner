import { useState, useMemo } from 'react'

const STORAGE_KEY = 'financial-planner-state'

export const CAREER_STAGES = [
  'Ensino Médio', 'Graduando', 'Recém-formado',
  'Pleno', 'Sênior', 'Gestor', 'Empreendedor',
]

export const FIELDS = ['Tech', 'Saúde', 'Direito', 'Finanças', 'Educação', 'Outro']

export const FIELD_BONUS = {
  Tech: 0.10, Saúde: 0.00, Direito: 0.05,
  Finanças: 0.05, Educação: -0.05, Outro: 0.00,
}

// Growth rate bands per stage: [anos 1-3, anos 4-7, anos 8-12, anos 13+]
const STAGE_GROWTH = {
  'Ensino Médio':  [0.20, 0.12, 0.06, 0.030],
  'Graduando':     [0.20, 0.12, 0.06, 0.030],
  'Recém-formado': [0.18, 0.10, 0.05, 0.025],
  'Pleno':         [0.12, 0.08, 0.04, 0.025],
  'Sênior':        [0.08, 0.06, 0.03, 0.020],
  'Gestor':        [0.06, 0.05, 0.03, 0.020],
  'Empreendedor':  [0.15, 0.10, 0.05, 0.030],
}

function salaryGrowthRate(year, careerStage, fieldOfWork) {
  const [r0, r1, r2, r3] = STAGE_GROWTH[careerStage] ?? STAGE_GROWTH['Pleno']
  const base = year <= 3 ? r0 : year <= 7 ? r1 : year <= 12 ? r2 : r3
  return base * (1 + (FIELD_BONUS[fieldOfWork] ?? 0))
}

const DEFAULT_STATE = {
  income:          15000,
  savePct:         35,
  returnRate:      10,
  startingCapital: 30000,
  horizonYears:    15,
  currentAge:      22,
  inflation:       5,
  careerStage:     'Recém-formado',
  fieldOfWork:     'Tech',
  goals: {
    house:   { label: 'Casa',                    icon: '⌂', value: 4000000, color: '#c9a84c' },
    car:     { label: 'Veículo',                 icon: '◈', value: 2000000, color: '#e0e0e0' },
    reserve: { label: 'Reserva / Investimentos', icon: '◆', value: 2000000, color: '#7fb3c8' },
  },
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const saved = JSON.parse(raw)
    const goals = {}
    for (const [id, def] of Object.entries(DEFAULT_STATE.goals)) {
      goals[id] = { ...def, ...(saved.goals?.[id] ?? {}) }
    }
    return { ...DEFAULT_STATE, ...saved, goals }
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

export function useFinancialPlan() {
  const [state, setState] = useState(loadState)

  function update(patch) {
    setState(prev => {
      const next = { ...prev, ...patch }
      saveState(next)
      return next
    })
  }

  function updateGoal(id, patch) {
    setState(prev => {
      const next = {
        ...prev,
        goals: { ...prev.goals, [id]: { ...prev.goals[id], ...patch } },
      }
      saveState(next)
      return next
    })
  }

  function reset() {
    saveState(DEFAULT_STATE)
    setState(DEFAULT_STATE)
  }

  const calc = useMemo(() => {
    const {
      income, savePct, returnRate, startingCapital,
      horizonYears, currentAge, inflation, careerStage, fieldOfWork, goals,
    } = state

    const r   = returnRate / 100
    const inf = inflation  / 100
    const totalGoal = Object.values(goals).reduce((s, g) => s + g.value, 0)

    // Year-by-year projection with progressive salary growth
    const projection = []
    let balance = startingCapital
    let currentSalary = income

    for (let y = 1; y <= horizonYears; y++) {
      currentSalary = currentSalary * (1 + salaryGrowthRate(y, careerStage, fieldOfWork))
      const annualContrib = currentSalary * (savePct / 100) * 12
      balance = balance * (1 + r) + annualContrib
      projection.push({
        year: y,
        age: currentAge + y,
        salary: currentSalary,
        annualContrib,
        balance,
        realBalance: balance / Math.pow(1 + inf, y),
        pctOfGoal: Math.min((balance / totalGoal) * 100, 100),
      })
    }

    const lastRow     = projection[horizonYears - 1]
    const totalFV     = lastRow?.balance ?? 0
    const totalFVReal = lastRow?.realBalance ?? 0
    const gap         = totalGoal - totalFV
    const progressPct = Math.min((totalFV / totalGoal) * 100, 100)

    // Required savings baseline (fixed-income model, used as floor reference)
    const fvCapital    = startingCapital * Math.pow(1 + r, horizonYears)
    const annuityFactor = ((Math.pow(1 + r, horizonYears) - 1) / r) * (1 + r)
    const reqAnnual    = (totalGoal - fvCapital) / annuityFactor
    const requiredMonthlySavings = reqAnnual / 12
    const requiredIncome = requiredMonthlySavings / (savePct / 100)

    // Per-goal milestones: % covered now + estimated time to reach
    const goalMilestones = Object.entries(goals).map(([id, g]) => {
      const pctCovered = Math.min((startingCapital / g.value) * 100, 100)

      if (startingCapital >= g.value) {
        return {
          id, label: g.label, value: g.value, color: g.color, icon: g.icon,
          pctCovered: 100, yearsToGoal: 0, monthsToGoal: 0,
          yearReached: 0, ageAtGoal: currentAge,
        }
      }

      const idx = projection.findIndex(p => p.balance >= g.value)
      if (idx < 0) {
        return {
          id, label: g.label, value: g.value, color: g.color, icon: g.icon,
          pctCovered, yearsToGoal: null, monthsToGoal: null,
          yearReached: null, ageAtGoal: null,
        }
      }

      const hit      = projection[idx]
      const prevBal  = idx > 0 ? projection[idx - 1].balance : startingCapital
      const frac     = (g.value - prevBal) / (hit.balance - prevBal)
      const totalMo  = (hit.year - 1) * 12 + Math.round(frac * 12)
      const yearsToGoal  = Math.floor(totalMo / 12)
      const monthsToGoal = totalMo % 12
      const ageAtGoal    = currentAge + yearsToGoal + (monthsToGoal >= 6 ? 1 : 0)

      return {
        id, label: g.label, value: g.value, color: g.color, icon: g.icon,
        pctCovered, yearsToGoal, monthsToGoal, yearReached: hit.year, ageAtGoal,
      }
    })

    // Aggregate milestones: 10%, 25%, 50%, 100% of total goal
    const milestones = [0.1, 0.25, 0.5, 1.0].map(pct => {
      const target = totalGoal * pct
      const hit    = projection.find(p => p.balance >= target)
      return {
        pct,
        label: pct === 1 ? 'Meta atingida 🏁' : `${pct * 100}% do objetivo`,
        value: target,
        year:  hit?.year ?? null,
        age:   hit ? currentAge + hit.year : null,
      }
    })

    const monthlySavings = income * (savePct / 100)

    return {
      monthlySavings,
      totalGoal,
      totalFV,
      totalFVReal,
      gap,
      progressPct,
      requiredMonthlySavings,
      requiredIncome,
      projection,
      milestones,
      goalMilestones,
    }
  }, [state])

  return { state, calc, update, updateGoal, reset }
}
