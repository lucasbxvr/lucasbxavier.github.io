/* ═══════════════════════════════════════════
   lucasbxavier.com — main.js
   YoRHa Interface · NieR:Automata-inspired
   ═══════════════════════════════════════════ */

// ── Dot strip generator ──
function generateDots(el) {
  if (!el) return
  const gaps = [4, 6, 8, 10, 12, 14]
  let s = el.id === 'dot-top' ? 7 : 13
  function rand() {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    return s / 0x7fffffff
  }
  const frag = document.createDocumentFragment()
  const width = Math.max(window.innerWidth || 0, 1400)
  let x = 0
  while (x < width + 60) {
    const count = Math.floor(rand() * 4) + 1
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div')
      d.className = 'dot'
      frag.appendChild(d)
    }
    const gap = gaps[Math.floor(rand() * gaps.length)]
    const sp = document.createElement('div')
    sp.style.width = gap + 'px'
    sp.style.flexShrink = '0'
    frag.appendChild(sp)
    x += count * 9 + gap
  }
  el.appendChild(frag)
}

document.addEventListener('DOMContentLoaded', () => {
  generateDots(document.getElementById('dot-top'))
  generateDots(document.getElementById('dot-bottom'))
})

// ── Theme toggle ──
;(function () {
  const html = document.documentElement
  const saved = localStorage.getItem('nier-theme') || 'light'
  html.dataset.theme = saved

  const toggle = document.querySelector('.theme-toggle')
  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = html.dataset.theme === 'dark' ? 'light' : 'dark'
      html.dataset.theme = next
      localStorage.setItem('nier-theme', next)
    })
    toggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle.click()
      }
    })
  }
})()

// ── Language toggle ──
;(function () {
  const STORAGE_KEY = 'lbx-lang'
  const htmlEl = document.documentElement

  function setLang(lang) {
    htmlEl.setAttribute('data-lang', lang)
    htmlEl.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en')
    localStorage.setItem(STORAGE_KEY, lang)
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.dataset.langTarget === lang
      btn.classList.toggle('active', isActive)
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    })
  }

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'pt' || saved === 'en') setLang(saved)

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.langTarget))
  })
})()

// ── Scroll-based anchor highlighting ──
;(function () {
  const sections = document.querySelectorAll('.nier-anchor-section[id]')
  if (!sections.length) return

  const linkMap = new Map()
  document.querySelectorAll('.nier-panel-left a.nier-menu-row[href]').forEach(link => {
    const id = link.getAttribute('href').replace(/^#/, '')
    linkMap.set(id, link)
  })
  if (!linkMap.size) return

  function setActive(id) {
    linkMap.forEach((link, lid) => link.classList.toggle('active', lid === id))
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id)
    })
  }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 })

  sections.forEach(s => observer.observe(s))
  if (sections[0]) setActive(sections[0].id)
})()

// ── Copy email ──
const copyBtn = document.getElementById('copy')
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const em = document.getElementById('em')
    if (!em) return
    navigator.clipboard.writeText(em.textContent.trim()).then(() => {
      const spanEn = copyBtn.querySelector('[data-t="en"]')
      const spanPt = copyBtn.querySelector('[data-t="pt"]')
      if (spanEn) spanEn.textContent = 'Copied!'
      if (spanPt) spanPt.textContent = 'Copiado!'
      setTimeout(() => {
        if (spanEn) spanEn.textContent = 'Copy address'
        if (spanPt) spanPt.textContent = 'Copiar endereço'
      }, 1500)
    }).catch(() => {})
  })
}

// ── Mobile section select ──
;(function () {
  const sel = document.querySelector('.mobile-section-select')
  if (!sel) return

  // Scroll to section on change
  sel.addEventListener('change', () => {
    const target = document.querySelector(sel.value)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })

  // Update option labels when language changes
  function updateSelectLang(lang) {
    sel.querySelectorAll('option').forEach(opt => {
      const label = opt.dataset[lang]
      if (label) opt.textContent = label
    })
  }

  // Observe lang changes on <html>
  const observer = new MutationObserver(() => {
    updateSelectLang(document.documentElement.getAttribute('data-lang') || 'en')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] })

  // Set initial lang
  updateSelectLang(document.documentElement.getAttribute('data-lang') || 'en')
})()

// ── Copyright year ──
document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear())
