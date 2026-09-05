export function ScoreMeter({ label, value }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between font-ui text-xs">
        <span className="text-ink-2">{label}</span>
        <span className="text-gold">{pct}</span>
      </div>
      <div className="h-[7px] overflow-hidden rounded-full bg-[#201830]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet to-garnet"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
