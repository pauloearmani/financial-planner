import { Slider } from './Slider'
import { CAREER_STAGES, FIELDS, FIELD_BONUS } from '../hooks/useFinancialPlan'
import { fmt } from '../utils/formatters'
import styles from './Tab.module.css'

export function ProfileTab({ state, update }) {
  const { currentAge, startingCapital, careerStage, fieldOfWork } = state
  const bonus = FIELD_BONUS[fieldOfWork] ?? 0
  const bonusText =
    bonus > 0 ? `+${(bonus * 100).toFixed(0)}% no crescimento salarial` :
    bonus < 0 ? `${(bonus * 100).toFixed(0)}% no crescimento salarial` :
    'Sem ajuste no crescimento salarial'

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>Perfil pessoal</div>
        <Slider
          label="Idade atual"
          min={16} max={60} step={1}
          value={currentAge}
          onChange={v => update({ currentAge: v })}
          format={v => `${v} anos`}
        />
        <Slider
          label="Patrimônio atual"
          min={0} max={500000} step={5000}
          value={startingCapital}
          onChange={v => update({ startingCapital: v })}
          format={fmt}
        />
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Carreira</div>

        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel}>Estágio de carreira</label>
          <select
            className={styles.select}
            value={careerStage}
            onChange={e => update({ careerStage: e.target.value })}
          >
            {CAREER_STAGES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel}>Área de atuação</label>
          <select
            className={styles.select}
            value={fieldOfWork}
            onChange={e => update({ fieldOfWork: e.target.value })}
          >
            {FIELDS.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className={styles.bonusHint}>{fieldOfWork} — {bonusText}</div>
      </div>
    </div>
  )
}
