import dynamic from 'next/dynamic'
import { findings, severityColors, severityOrder, type Severity } from '../components/findings-data'

const SeverityChart = dynamic(() => import('../components/SeverityChart'), { ssr: false })
const TokenDrainBar = dynamic(() => import('../components/TokenDrainBar'), { ssr: false })

const counts: Record<Severity, number> = { critical: 0, high: 0, medium: 0, pass: 0 }
findings.forEach(f => counts[f.severity]++)

const vectors = [
  'Prompt injection',
  'Query param manipulation',
  'Oversized payloads',
  'Token budget abuse',
  'Rate limiting',
  'Concurrency and race conditions',
]

const recommendations = [
  'Implement rate limiting, per-key RPM cap (e.g. 60 req per min) and per-IP burst protection',
  'Return 400 with error when compression produces 0 tokens, do not bill on empty output',
  'Sanitize or strip instruction-pattern content from query or text before passing to compressor',
  'Deprecate GET endpoint for text payloads, route all traffic to POST with JSON body',
  'Document hard limits (500k char POST max), return structured JSON errors instead of HTML',
  'When target_tokens exceeds input size, return input unchanged, passthrough not recompression',
]

const disclosureTimeline = [
  { label: 'Testing began', value: 'April 19, 2026' },
  { label: 'Report drafted', value: 'April 20, 2026' },
  { label: 'Disclosed to vendor', value: 'April 20, 2026 → contact: support@litepruner.com' },
  { label: 'Patch status', value: 'Awaiting vendor response' },
]

export default function Page() {
  const sorted = [...findings].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
  const totalFindings = findings.length
  const highestSeverity = counts.critical ? 'Critical exposure' : counts.high ? 'High exposure' : 'Moderate exposure'
  const chartCounts: [number, number, number, number] = [counts.critical, counts.high, counts.medium, counts.pass]

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section
          className="overflow-hidden rounded-[32px] border px-6 py-8 sm:px-8 lg:px-10 lg:py-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(249,251,255,0.98) 100%)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em]" style={{ color: 'var(--text3)' }}>
                Security audit report
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl" style={{ color: 'var(--text)' }}>
                LitePruner API
              </h1>
              <p className="mt-4 text-lg" style={{ color: 'var(--text2)' }}>
                litepruner.ai · Scope: /compress-text, auth, concurrency · April 2026
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {([
                  { label: 'Total findings', value: totalFindings, tone: 'var(--text)', accent: 'var(--bg-accent)' },
                  { label: 'Critical', value: counts.critical, tone: '#b91c1c', accent: 'var(--red-bg)' },
                  { label: 'High', value: counts.high, tone: '#b45309', accent: 'var(--amber-bg)' },
                  { label: 'Medium', value: counts.medium, tone: '#1d4ed8', accent: 'var(--blue-bg)' },
                ] as const).map((m) => (
                  <div
                    key={m.label}
                    className="rounded-[24px] border p-5"
                    style={{ background: m.accent, borderColor: 'var(--border)' }}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--text3)' }}>
                      {m.label}
                    </p>
                    <p className="mt-4 text-4xl font-semibold tracking-[-0.04em]" style={{ color: m.tone }}>
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="flex h-full flex-col justify-between rounded-[28px] border p-6 lg:p-7"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--text3)' }}>
                  Executive snapshot
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]" style={{ color: 'var(--text)' }}>
                  {highestSeverity}
                </p>
                <p className="mt-3 text-base" style={{ color: 'var(--text2)' }}>
                  Findings are preserved below in full, with severity visualizations and exhaustion telemetry layered in for faster review.
                </p>
              </div>

              <div className="mt-8 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--text3)' }}>
                  Disclosure Timeline
                </p>
                <div className="space-y-4" style={{ fontFamily: 'Consolas, "SFMono-Regular", "Cascadia Code", monospace' }}>
                  {disclosureTimeline.map((item, index) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="flex flex-col items-center pt-1">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#94a3b8' }} />
                        {index < disclosureTimeline.length - 1 ? (
                          <span className="mt-2 h-10 w-px" style={{ background: 'rgba(148, 163, 184, 0.35)' }} />
                        ) : null}
                      </div>
                      <div className="min-w-0 pb-1">
                        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text3)' }}>
                          {item.label}
                        </p>
                        <p className="mt-1 break-words text-sm" style={{ color: 'var(--text2)' }}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--text3)' }}>
                  Attack vectors tested
                </p>
                <div className="flex flex-wrap gap-3">
                  {vectors.map(v => (
                    <span
                      key={v}
                      className="rounded-full border px-4 py-2 text-sm font-medium"
                      style={{
                        background: 'var(--bg-soft)',
                        borderColor: 'var(--border)',
                        color: 'var(--text2)',
                      }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
          <section
            className="rounded-[32px] border p-6 sm:p-8"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--text3)' }}>
                Severity distribution
              </p>
              <div className="rounded-full border px-4 py-2 text-sm font-semibold" style={{ color: 'var(--text2)', borderColor: 'var(--border)', background: 'var(--bg-accent)' }}>
                {totalFindings} total
              </div>
            </div>

            <SeverityChart counts={chartCounts} />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(['critical', 'high', 'medium', 'pass'] as Severity[]).map(s => (
                <div
                  key={s}
                  className="flex items-center justify-between rounded-2xl border px-4 py-3"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-accent)' }}
                >
                  <span className="flex items-center gap-3 text-sm font-medium" style={{ color: 'var(--text2)' }}>
                    <span className={`inline-block h-3 w-3 rounded-full ${severityColors[s].dot}`} />
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                    {counts[s]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div
              className="rounded-[32px] border p-6 sm:p-8"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--text3)' }}>
                Attack vectors tested
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {vectors.map((v, index) => (
                  <div
                    key={v}
                    className="rounded-[22px] border px-4 py-4"
                    style={{ background: index < 3 ? '#f8fbff' : '#ffffff', borderColor: 'var(--border)' }}
                  >
                    <p className="text-base font-semibold" style={{ color: 'var(--text2)' }}>
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-[32px] border p-6 sm:p-8"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--text3)' }}>
                Recommendations
              </p>
              <div className="flex flex-col gap-4">
                {recommendations.map((r, i) => (
                  <div key={i} className="flex gap-4 rounded-2xl border px-4 py-4 text-base leading-relaxed" style={{ borderColor: 'var(--border)', background: 'var(--bg-accent)' }}>
                    <span className="font-semibold" style={{ color: 'var(--text3)', minWidth: 28 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: 'var(--text2)' }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--text3)' }}>
            Token drain, controlled exhaustion test
          </p>
          <TokenDrainBar />
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em]" style={{ color: 'var(--text3)' }}>
              Findings
            </p>
            <div className="rounded-full border px-4 py-2 text-sm font-semibold" style={{ color: 'var(--text2)', borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
              Sorted by severity
            </div>
          </div>

          <div className="grid gap-5">
            {sorted.map(f => {
              const c = severityColors[f.severity]
              const accent = f.severity === 'critical'
                ? 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)'
                : f.severity === 'high'
                  ? 'linear-gradient(135deg, #fffaf2 0%, #ffffff 100%)'
                  : f.severity === 'medium'
                    ? 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)'
                    : 'linear-gradient(135deg, #f6fff7 0%, #ffffff 100%)'

              return (
                <article
                  key={f.id}
                  className="rounded-[28px] border p-6 sm:p-7"
                  style={{
                    background: accent,
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border px-3 py-1.5 text-sm font-semibold" style={{ color: 'var(--text3)', borderColor: 'var(--border)', background: '#ffffff' }}>
                          {f.id}
                        </span>
                        <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-[1.75rem]" style={{ color: 'var(--text)' }}>
                          {f.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="w-fit rounded-full border px-3.5 py-1.5 text-sm font-semibold"
                        style={{
                          background: '#f8fafc',
                          borderColor: 'rgba(148, 163, 184, 0.28)',
                          color: '#475569',
                        }}
                      >
                        CVSS {f.cvss}
                      </span>
                      <span className={`w-fit rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize ${c.badge}`}>
                        {f.severity}
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-base leading-8 sm:text-lg" style={{ color: 'var(--text2)' }}>
                    {f.desc}
                  </p>

                  <div className="mt-5 rounded-[22px] border px-4 py-4" style={{ borderColor: 'var(--border)', background: '#ffffff' }}>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--text3)' }}>
                      Evidence
                    </p>
                    <p className="text-base leading-7 sm:text-lg" style={{ color: 'var(--text2)', fontFamily: 'Consolas, "SFMono-Regular", "Cascadia Code", monospace' }}>
                      {f.evidence}
                    </p>
                  </div>

                  {f.reproductionExample ? (
                    <div className="mt-4 rounded-[22px] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'rgba(248, 250, 252, 0.92)' }}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--text3)' }}>
                        Reproduction example
                      </p>
                      <div
                        className="space-y-2 rounded-2xl border px-4 py-4 text-sm leading-6 sm:text-[0.95rem]"
                        style={{
                          borderColor: 'rgba(148, 163, 184, 0.18)',
                          background: '#ffffff',
                          color: 'var(--text2)',
                          fontFamily: 'Consolas, "SFMono-Regular", "Cascadia Code", monospace',
                        }}
                      >
                        <p className="break-words"><span style={{ color: 'var(--text3)' }}>Endpoint:</span> {f.reproductionExample.endpoint}</p>
                        <p className="break-all"><span style={{ color: 'var(--text3)' }}>Request:</span> {f.reproductionExample.request}</p>
                        <p className="break-words"><span style={{ color: 'var(--text3)' }}>Observed:</span> {f.reproductionExample.observed}</p>
                        <p className="break-words"><span style={{ color: 'var(--text3)' }}>Expected:</span> {f.reproductionExample.expected}</p>
                      </div>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>

        <footer className="pb-4 pt-10">
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm" style={{ color: 'var(--text3)' }}>
            <span>Conducted by Pratham Hegde ·</span>
            <a href="https://prathamhegde.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text3)', textDecoration: 'underline' }}>
              prathamhegde.com
            </a>
            <span>· Arizona State University · April 2026 · Responsible disclosure: support@litepruner.com</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
