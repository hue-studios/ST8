/**
 * The line drawings that trace themselves as the visitor scrolls (organization, program and Housing story columns).
 * Each path starts fully hidden (dash offset = its length) and is drawn in proportion to how far the page has
 * scrolled relative to the container's height. Browser-only: the paths are measured in onMounted, and
 * useEventListener removes the scroll listener when the page unmounts on navigation.
 */
const START = 0.8

export function useScrollLine(options: { container: string, paths: string[], factor: number }) {
  const lines: Array<{ el: SVGPathElement, length: number }> = []

  onMounted(() => {
    for (const id of options.paths) {
      const el = document.getElementById(id) as unknown as SVGPathElement | null
      if (!el) continue
      const length = el.getTotalLength()
      el.style.strokeDasharray = String(length)
      el.style.strokeDashoffset = String(length)
      lines.push({ el, length })
    }
  })

  let frame = 0
  useEventListener('scroll', () => {
    if (!lines.length || frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      const container = document.getElementById(options.container)
      if (!container) return
      // Drawing starts when the container's top reaches 80% of the way down the viewport, not at the top of the
      // page. Clamped rather than skipped, so a fast scroll past the end still finishes the line.
      const rect = container.getBoundingClientRect()
      const scrollPercent = Math.min(1, Math.max(0, ((window.innerHeight * START - rect.top) / rect.height) * options.factor))
      for (const { el, length } of lines) el.style.strokeDashoffset = String(length - length * scrollPercent)
    })
  }, { passive: true })

  onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame)
  })
}
