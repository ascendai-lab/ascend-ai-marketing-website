/** Accordions marked [data-one-open] keep one item open at a time. */
document.querySelectorAll<HTMLElement>('[data-one-open]').forEach((group) => {
  group.addEventListener('toggle', (event) => {
    const opened = event.target as HTMLDetailsElement
    if (!opened.open) return
    group.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((d) => { if (d !== opened) d.open = false })
  }, true)
})
