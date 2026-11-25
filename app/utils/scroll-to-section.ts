/**
 * Smooth-scrolls so the element's top lands just below the site header. The header slims on the way down and returns
 * to full height on the way up (or near the top), so the offset is the height it will have when the scroll ends.
 */
export function scrollToSection(selector: string) {
  const element = document.querySelector<HTMLElement>(selector)
  if (!element) return

  const elementTop = element.getBoundingClientRect().top + window.scrollY
  const goingDown = elementTop > window.scrollY
  const styles = getComputedStyle(document.documentElement)
  const fullBar = Number.parseFloat(styles.getPropertyValue('--st8-header-full')) || 0
  const compactBar = Number.parseFloat(styles.getPropertyValue('--st8-header-compact')) || fullBar

  // The header stays full height within 80px of the top (PageHeader's SCROLLED_AT).
  const compactTop = Math.max(elementTop - compactBar, 0)
  const top = goingDown && compactTop > 80 ? compactTop : Math.max(elementTop - fullBar, 0)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
}
