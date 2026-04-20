'use client'
import { useEffect, useRef } from 'react'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

interface SeverityChartProps {
  counts: [number, number, number, number]
}

export default function SeverityChart({ counts }: SeverityChartProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const chart = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Pass'],
        datasets: [{
          data: counts,
          backgroundColor: ['#dc2626', '#f59e0b', '#2563eb', '#16a34a'],
          hoverBackgroundColor: ['#b91c1c', '#d97706', '#1d4ed8', '#15803d'],
          borderRadius: 999,
          borderSkipped: false,
          barThickness: 38,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} finding${ctx.parsed.y !== 1 ? 's' : ''}`,
        }}},
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: '#475569',
              font: { size: 13, weight: 600 },
            },
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...counts, 4),
            ticks: {
              stepSize: 1,
              color: '#64748b',
              font: { size: 12 },
            },
            border: { display: false },
            grid: { color: 'rgba(148, 163, 184, 0.18)' },
          },
        },
      },
    })
    return () => chart.destroy()
  }, [counts])

  return (
    <div className="relative" style={{ height: 260 }}>
      <canvas
        ref={ref}
        role="img"
        aria-label={`Bar chart: ${counts[0]} critical, ${counts[1]} high, ${counts[2]} medium, ${counts[3]} pass`}
      >
        {counts[0]} critical, {counts[1]} high, {counts[2]} medium, {counts[3]} pass
      </canvas>
    </div>
  )
}
