export function elementInViewport(el: any) {
  const rect = el.getBoundingClientRect()
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight
  const offsetTop = 150

  return rect.top >= 0 && rect.left >= 0 && rect.top <= windowHeight + offsetTop
}
