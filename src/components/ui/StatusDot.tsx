interface StatusDotProps {
  status: 'complete' | 'in-progress' | 'planned'
}

const config = {
  complete: { label: 'Complete', dot: 'bg-teal-400', pulse: false },
  'in-progress': { label: 'In Progress', dot: 'bg-amber-400', pulse: true },
  planned: { label: 'Planned', dot: 'bg-white/30', pulse: false },
}

export function StatusDot({ status }: StatusDotProps) {
  const { label, dot, pulse } = config[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-text/50">
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${dot} opacity-75 animate-ping`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`} />
      </span>
      {label}
    </span>
  )
}
