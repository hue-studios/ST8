/**
 * The line drawings that trace themselves as the visitor scrolls (organization, program, initiative, Housing and
 * how-to-apply story columns). Each path starts fully hidden (dash offset = its length). On every scroll frame the
 * drawn length is chosen so the tip of the line sits at `tip` (a fraction of the viewport height, 0 = top, 1 =
 * bottom): the line therefore stays at the visitor's eye level however tall or winding the drawing is, and finishes
 * when its end reaches that point. Browser-only: the paths are sampled in onMounted, and useEventListener removes
 * the scroll and resize listeners when the page unmounts on navigation.
 */
const SAMPLES = 240

interface Line {
  el: SVGPathElement
  length: number
  /** Running maximum of the path's y (in its own coordinates) at SAMPLES + 1 evenly spaced lengths. */
  reach: number[]
}

export function useScrollLine(options: { paths: string[], tip?: number }) {
  const tip = options.tip ?? 0.6
  const lines: Line[] = []

  onMounted(() => {
    for (const id of options.paths) {
      const el = document.getElementById(id) as unknown as SVGPathElement | null
      if (!el) continue
      const length = el.getTotalLength()
      el.style.strokeDasharray = String(length)
      el.style.strokeDashoffset = String(length)
      // A running maximum keeps the lookup valid for curves that double back on themselves.
      const reach: number[] = []
      let max = -Infinity
      for (let i = 0; i <= SAMPLES; i++) {
        max = Math.max(max, el.getPointAtLength((length * i) / SAMPLES).y)
        reach.push(max)
      }
      lines.push({ el, length, reach })
    }
    update()
  })

  function drawnFraction({ el, reach }: Line) {
    const m = el.getScreenCTM()
    if (!m || !m.d) return 0 // Not rendered at this width (display: none).
    // A fixed drawing never moves on screen, so it fills in step with the page's overall scroll instead.
    if (el.ownerSVGElement && getComputedStyle(el.ownerSVGElement).position === 'fixed') {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      return scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
    }
    const target = (window.innerHeight * tip - m.f) / m.d
    if (target <= reach[0]!) return 0
    if (target >= reach[SAMPLES]!) return 1
    let i = 1
    while (reach[i]! < target) i++
    const span = reach[i]! - reach[i - 1]!
    return (i - 1 + (span > 0 ? (target - reach[i - 1]!) / span : 0)) / SAMPLES
  }

  function update() {
    for (const line of lines) {
      line.el.style.strokeDashoffset = String(line.length - line.length * drawnFraction(line))
    }
  }

  let frame = 0
  function schedule() {
    if (!lines.length || frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      update()
    })
  }
  useEventListener('scroll', schedule, { passive: true })
  useEventListener('resize', schedule, { passive: true })

  onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame)
  })
}
