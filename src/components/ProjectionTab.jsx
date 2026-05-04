import { fmt } from '../utils/formatters'
import styles from './Tab.module.css'

export function ProjectionTab({ state, calc }) {
  const { projection, milestones, totalGoal } = calc

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Marcos do caminho</div>
        {milestones.map((m, i) => (
          <div key={i} className={styles.row}>
            <div>
              <div className={styles.rowLabel}>{m.label}</div>
              <div className={styles.rowSub}>{fmt(m.value)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.rowValue} style={{ color: 'var(--gold)' }}>
                {m.year ? `Ano ${m.year}` : '> 15 anos'}
              </div>
              <div className={styles.rowSub}>{m.age ? `${m.age} anos` : 'Fora do prazo'}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Evolução ano a ano</div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                {['Ano', 'Idade', 'Patrimônio'].map(h => (
                  <th key={h} className={styles.th} style={{ textAlign: h === 'Patrimônio' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projection.map((row, i) => {
                const isGoal = row.balance >= totalGoal && (projection[i - 1]?.balance ?? 0) < totalGoal
                return (
                  <tr key={row.year} style={{ background: isGoal ? 'var(--green-bg)' : 'transparent' }}>
                    <td className={styles.td} style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{row.year}</td>
                    <td className={styles.td} style={{ color: 'var(--text-sub)' }}>{row.age}</td>
                    <td className={styles.td} style={{ textAlign: 'right', color: row.balance >= totalGoal ? 'var(--green)' : 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
                      {fmt(row.balance)} {isGoal ? '✓' : ''}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
