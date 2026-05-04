import { fmt, fmtShort } from '../utils/formatters'
import styles from './Tab.module.css'

export function ProjectionTab({ state, calc }) {
  const { projection, milestones, totalGoal, totalFVReal } = calc
  const { horizonYears, currentAge } = state

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
                {m.year ? `Ano ${m.year}` : `> ${horizonYears} anos`}
              </div>
              <div className={styles.rowSub}>{m.age ? `${m.age} anos` : 'Fora do prazo'}</div>
            </div>
          </div>
        ))}
        <div className={styles.divider} />
        <div className={styles.row}>
          <div>
            <div className={styles.rowLabel}>Valor real ao final</div>
            <div className={styles.rowSub}>Poder de compra hoje · {currentAge + horizonYears} anos</div>
          </div>
          <span className={styles.rowValue} style={{ color: 'var(--blue)' }}>{fmt(totalFVReal)}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Evolução ano a ano</div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table} style={{ minWidth: 560 }}>
            <thead>
              <tr>
                {[
                  { label: 'Ano',    align: 'left'  },
                  { label: 'Idade',  align: 'left'  },
                  { label: 'Salário', align: 'right' },
                  { label: 'Aporte', align: 'right' },
                  { label: 'Nominal', align: 'right' },
                  { label: 'Real',   align: 'right' },
                  { label: '% Meta', align: 'right' },
                ].map(({ label, align }) => (
                  <th key={label} className={styles.th} style={{ textAlign: align }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projection.map((row, i) => {
                const isGoal = row.balance >= totalGoal && (projection[i - 1]?.balance ?? 0) < totalGoal
                return (
                  <tr key={row.year} style={{ background: isGoal ? 'var(--green-bg)' : 'transparent' }}>
                    <td className={styles.td} style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {row.year}
                    </td>
                    <td className={styles.td} style={{ color: 'var(--text-sub)' }}>
                      {row.age}
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                      {fmtShort(row.salary)}
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--gold-dark)' }}>
                      {fmtShort(row.annualContrib)}
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: row.balance >= totalGoal ? 'var(--green)' : 'var(--gold)' }}>
                      {fmtShort(row.balance)}{isGoal ? ' ✓' : ''}
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>
                      {fmtShort(row.realBalance)}
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {row.pctOfGoal.toFixed(0)}%
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
