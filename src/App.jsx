import { useState } from 'react'
import { useFinancialPlan } from './hooks/useFinancialPlan'
import { ProfileTab }    from './components/ProfileTab'
import { OverviewTab }   from './components/OverviewTab'
import { GoalsTab }      from './components/GoalsTab'
import { ProjectionTab } from './components/ProjectionTab'
import { fmt }           from './utils/formatters'
import styles            from './App.module.css'

const TABS = [
  { id: 'perfil',   label: 'Perfil' },
  { id: 'overview', label: 'Overview' },
  { id: 'metas',    label: 'Metas' },
  { id: 'projeção', label: 'Projeção' },
]

export default function App() {
  const { state, calc, update, updateGoal, reset } = useFinancialPlan()
  const [activeTab, setActiveTab] = useState('perfil')
  const { totalFV, totalGoal, gap, progressPct } = calc
  const onTarget = gap <= 0

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>Planejador Financeiro · {state.horizonYears} Anos</div>
        <h1 className={styles.title}>
          Planejador<br />
          <em className={styles.titleAccent}>Financeiro</em>
        </h1>
        <p className={styles.subtitle}>
          {state.currentAge} anos → {state.currentAge + state.horizonYears} anos
          {' · '}{state.careerStage}{' · '}{state.fieldOfWork}
        </p>
      </header>

      <main className={styles.main}>
        <div className={styles.statusCard}>
          <div className={styles.statusTop}>
            <div>
              <div className={styles.statusEyebrow}>Patrimônio projetado</div>
              <div className={styles.statusValue} style={{ color: onTarget ? 'var(--blue)' : 'var(--gold)' }}>
                {fmt(totalFV)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.statusEyebrow}>Meta total</div>
              <div className={styles.statusGoal}>{fmt(totalGoal)}</div>
            </div>
          </div>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                width: `${progressPct}%`,
                background: onTarget
                  ? 'linear-gradient(90deg, #3a7a5a, #5ab38a)'
                  : 'linear-gradient(90deg, var(--gold-dark), var(--gold))',
              }}
            />
          </div>
          <div className={styles.progressMeta}>
            <span>{progressPct.toFixed(0)}% da meta</span>
            <span style={{ color: onTarget ? 'var(--green)' : 'var(--red)' }}>
              {onTarget ? `Excede em ${fmt(-gap)}` : `Faltam ${fmt(gap)}`}
            </span>
          </div>
        </div>

        <nav className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {activeTab === 'perfil'   && <ProfileTab    state={state} update={update} />}
        {activeTab === 'overview' && <OverviewTab   state={state} calc={calc} update={update} />}
        {activeTab === 'metas'    && <GoalsTab      state={state} calc={calc} updateGoal={updateGoal} />}
        {activeTab === 'projeção' && <ProjectionTab state={state} calc={calc} />}

        <p className={styles.disclaimer}>
          Projeção simplificada · Não considera IR sobre rendimentos
          {' · '}
          <button className={styles.resetBtn} onClick={reset}>Resetar</button>
        </p>
      </main>
    </div>
  )
}
