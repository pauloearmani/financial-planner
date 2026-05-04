import { Slider } from './Slider'
import { fmt, fmtPct } from '../utils/formatters'
import styles from './Tab.module.css'

export function OverviewTab({ state, calc, update }) {
  const { income, savePct, returnRate } = state
  const { monthlySavings, requiredMonthlySavings, requiredIncome } = calc
  const onTarget = requiredIncome <= income

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Parâmetros mensais</div>
        <Slider label="Renda mensal bruta"     min={5000}  max={100000} step={1000} value={income}      onChange={v => update({ income: v })}      format={fmt}    />
        <Slider label="% guardada / investida" min={10}    max={70}     step={1}    value={savePct}    onChange={v => update({ savePct: v })}    format={fmtPct} />
        <Slider label="Retorno anual estimado" min={6}     max={18}     step={0.5}  value={returnRate}  onChange={v => update({ returnRate: v })}  format={fmtPct} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Divisão mensal</div>
        {[
          { label: 'Investido / Poupado', value: monthlySavings,          color: 'var(--gold)' },
          { label: 'Custo de vida',       value: income - monthlySavings, color: 'var(--text-muted)' },
        ].map(item => (
          <div key={item.label} className={styles.row}>
            <div className={styles.rowLeft}>
              <div className={styles.dot} style={{ background: item.color }} />
              <span className={styles.rowLabel}>{item.label}</span>
            </div>
            <span className={styles.rowValue} style={{ color: item.color }}>{fmt(item.value)}</span>
          </div>
        ))}
      </div>

      <div className={styles.card} style={{
        background: onTarget ? 'var(--green-bg)' : 'var(--red-bg)',
        borderColor: onTarget ? 'var(--green-border)' : 'var(--red-border)',
      }}>
        <div className={styles.cardTitle}>Para atingir a meta em {state.horizonYears} anos</div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Renda mínima necessária</span>
          <span className={styles.rowValue} style={{ color: onTarget ? 'var(--green)' : 'var(--red)' }}>
            {fmt(requiredIncome)}/mês
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Aporte mensal necessário</span>
          <span className={styles.rowValue} style={{ color: 'var(--gold)' }}>
            {fmt(requiredMonthlySavings)}/mês
          </span>
        </div>
      </div>
    </div>
  )
}
