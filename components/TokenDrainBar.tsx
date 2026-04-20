'use client'
import { useEffect, useState } from 'react'

export default function TokenDrainBar() {
  const [pct, setPct] = useState(0)
  const [val, setVal] = useState(0)
  const target = 1000000

  useEffect(() => {
    const duration = 3000
    const steps = 90
    let step = 0
    let interval: ReturnType<typeof setInterval>

    // Delay start so component is fully painted before animating
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        step++
        const progress = step / steps
        const eased = 1 - Math.pow(1 - progress, 3)
        setPct(Math.min(100, eased * 100))
        setVal(Math.round(eased * target))
        if (step >= steps) {
          clearInterval(interval)
          setPct(100)
          setVal(target)
        }
      }, duration / steps)
    }, 800)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="rounded-[28px] border p-6 md:p-8" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(240px,0.8fr)]">
        <div>
          <div className="flex justify-between gap-4 text-sm font-medium mb-3" style={{ color: 'var(--text2)' }}>
            <span>tokens consumed</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {val.toLocaleString()} / {target.toLocaleString()}
            </span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 18, background: '#e2e8f0' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct.toFixed(2)}%`,
                background: 'linear-gradient(90deg, #f97316 0%, #ef4444 55%, #dc2626 100%)',
                transition: 'width 0.04s linear',
              }}
            />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Concurrent load', value: '50 request burst' },
              { label: 'Throttle response', value: '0 rate-limit events' },
              { label: 'Drain ceiling', value: '1,000,000 tokens' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border px-4 py-4"
                style={{ background: 'var(--bg-accent)', borderColor: 'var(--border)' }}
              >
                <p className="text-xs uppercase tracking-[0.22em]" style={{ color: 'var(--text3)' }}>
                  {item.label}
                </p>
                <p className="mt-2 text-base font-semibold" style={{ color: 'var(--text)' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] p-5" style={{ background: 'linear-gradient(180deg, #fff7ed 0%, #fff1f2 100%)', border: '1px solid rgba(248, 113, 113, 0.16)' }}>
          <p className="text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--text3)' }}>
            Controlled exhaustion
          </p>
          <div className="mt-4 space-y-3">
            {[20, 40, 60, 80, 100].map((mark) => (
              <div key={mark} className="flex items-center gap-3">
                <span className="w-10 text-xs font-medium" style={{ color: 'var(--text3)' }}>
                  {mark}%
                </span>
                <div className="h-2 flex-1 rounded-full" style={{ background: mark <= pct ? 'linear-gradient(90deg, #fb923c 0%, #ef4444 100%)' : '#fed7aa' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm" style={{ color: 'var(--text3)' }}>
        Demonstrates F-01 — no rate limiting. 1,000,000 tokens drained via concurrent requests with zero throttling.
      </p>
    </div>
  )
}
