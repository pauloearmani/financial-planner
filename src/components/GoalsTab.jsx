import { Slider } from './Slider'
import { GaugeBar } from './GaugeBar'
import { fmt } from '../utils/formatters'
import styles from './Tab.module.css'

export function GoalsTab({ state, calc, updateGoal }) {
  const { goals } = state
  const { totalGoal } = calc

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Ajuste suas metas</div>
        {Object.entries(goals).map(([id, g]) => (
          <div key={id} style={{ marginBottom: '1.8rem' }}>
            <div className={styles.goalHeader}>
              <span style={{ color: g.color }}>{g.icon}</span>
              <span className={styles.goalLabel}>{g.label}</span>
            </div>
            <Slider
              label=""
              min={500000} max={10000000} step={100000}
              value={g.value}
              onChange={v => updateGoal(id, v)}
              format={fmt}
            />
          </div>
        ))}
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
