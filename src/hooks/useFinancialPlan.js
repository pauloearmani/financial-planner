import { useState, useMemo } from 'react'

const STORAGE_KEY = 'financial-planner-state'

const DEFAULT_STATE = {
  income: 15000,
  savePct: 35,
  returnRate: 10,
  startingCapital: 30000,
  horizonYears: 15,
  currentAge: 22,
  goals: {
    house:   { label: 'Casa em Vitória',        icon: '⌂', value: 4000000, color: '#c9a84c' },
    car:     { label: 'Porsche 911 Turbo S',     icon: '◈', value: 2000000, color: '#e0e0e0' },
    reserve: { label: 'Reserva / Investimentos', icon: '◆', value: 2000000, color: '#7fb3c8' },
  },
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
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

  function updateGoal(id, value) {
    setState(prev => {
      const next = {
        ...prev,
        goals: { ...prev.goals, [id]: { ...prev.goals[id], value } },
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
    const { income, savePct, returnRate, startingCapital, horizonYears, currentAge, goals } = state

    const r = returnRate / 100
    const monthlySavings = income * (savePct / 100)
    const annualSavings  = monthlySavings * 12
    const totalGoal      = Object.values(goals).reduce((s, g) => s + g.value, 0)

    // Future value of starting capital
    const fvCapital = startingCapital * Math.pow(1 + r, horizonYears)

    // Future value of annuity (end-of-year contributions, grown for one extra period)
    const fvAnnuity = annualSavings * ((Math.pow(1 + r, horizonYears) - 1) / r) * (1 + r)

    const totalFV   = fvCapital + fvAnnuity
    const gap       = totalGoal - totalFV
    const progressPct = Math.min((totalFV / totalGoal) * 100, 100)

    // Required savings to hit goal exactly
    const requiredAnnualSavings   = (totalGoal - fvCapital) / (((Math.pow(1 + r, horizonYears) - 1) / r) * (1 + r))
    const requiredMonthlySavings  = requiredAnnualSavings / 12
    const requiredIncome          = requiredMonthlySavings / (savePct / 100)

    // Year-by-year projection
    const projection = []
    let balance = startingCapital
    for (let y = 1; y <= horizonYears; y++) {
      balance = balance * (1 + r) + annualSavings
      projection.push({ year: y, age: currentAge + y, balance })
    }

    // Milestones
    const milestoneTargets = [0.1, 0.25, 0.5, 1.0]
    const milestones = milestoneTargets.map(pct => {
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

    return {
      monthlySavings,
      annualSavings,
      totalGoal,
      fvCapital,
      fvAnnuity,
      totalFV,
      gap,
      progressPct,
      requiredMonthlySavings,
      requiredIncome,
      projection,
      milestones,
    }
  }, [state])

  return { state, calc, update, updateGoal, reset }
}
