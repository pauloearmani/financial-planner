import { fmt } from '../utils/formatters'
import styles from './GaugeBar.module.css'

export function GaugeBar({ label, value, max, color, sublabel }) {
  const pct = Math.min((value / max) * 100, 100)

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value} style={{ color }}>{fmt(value)}</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: color }} />
      </div>
      {sublabel && <div className={styles.sublabel}>{sublabel}</div>}
    </div>
  )
}
