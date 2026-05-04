import { Slider } from './Slider'
import { GaugeBar } from './GaugeBar'
import { fmt } from '../utils/formatters'
import styles from './Tab.module.css'

export function GoalsTab({ state, calc, updateGoal }) {
  const { goals, horizonYears } = state
  const { totalGoal, goalMilestones } = calc

  const milestoneMap = Object.fromEntries(goalMilestones.map(m => [m.id, m]))

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Ajuste suas metas</div>
        {Object.entries(goals).map(([id, g]) => {
          const m = milestoneMap[id]

          const timeText =
            m.yearsToGoal === null
              ? `Fora do prazo (> ${horizonYears} anos)`
              : m.yearsToGoal === 0 && m.monthsToGoal === 0
              ? 'Já atingida'
              : m.monthsToGoal === 0
              ? `~${m.yearsToGoal} anos (aos ${m.ageAtGoal})`
              : `~${m.yearsToGoal} anos e ${m.monthsToGoal} meses (aos ${m.ageAtGoal})`

          return (
            <div key={id} style={{ marginBottom: '1.8rem' }}>
              <div className={styles.goalHeader}>
                <span style={{ color: g.color }}>{g.icon}</span>
                <input
                  className={styles.goalNameInput}
                  type="text"
                  value={g.label}
                  onChange={e => updateGoal(id, { label: e.target.value })}
                  placeholder="Nome do objetivo"
                />
              </div>
              <Slider
                label=""
                min={500000} max={10000000} step={100000}
                value={g.value}
                onChange={v => updateGoal(id, { value: v })}
                format={fmt}
              />
              <div className={styles.goalMilestone}>
                {m.pctCovered.toFixed(1)}% já coberto
                {' · '}
                <span className={m.yearsToGoal !== null ? styles.goalMilestoneGood : styles.goalMilestoneBad}>
                  {timeText}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Peso de cada meta</div>
        {Object.entries(goals).map(([id, g]) => (
          <GaugeBar
            key={id}
            label={g.label}
            value={g.value}
            max={totalGoal}
            color={g.color}
            sublabel={`${((g.value / totalGoal) * 100).toFixed(0)}% do total`}
          />
        ))}
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.rowLabel}>Total das metas</span>
          <span className={styles.rowValue} style={{ color: 'var(--gold)' }}>{fmt(totalGoal)}</span>
        </div>
      </div>
    </div>
  )
}
