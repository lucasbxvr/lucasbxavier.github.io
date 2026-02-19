/* ═══════════════════════════════════════════
   lucasbxavier.com — main.js
   ═══════════════════════════════════════════ */

// ── Copyright year ──
document.querySelectorAll('#y').forEach(el => el.textContent = new Date().getFullYear())

// ── Copy email ──
const copyBtn = document.getElementById('copy')
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const em = document.getElementById('em')
    if (!em) return
    navigator.clipboard.writeText(em.textContent.trim()).then(() => {
      const lang = document.documentElement.dataset.lang
      copyBtn.querySelector('[lang="en"]') && (copyBtn.querySelector('[lang="en"]').textContent = 'Copied!')
      copyBtn.querySelector('[lang="pt"]') && (copyBtn.querySelector('[lang="pt"]').textContent = 'Copiado!')
      setTimeout(() => {
        copyBtn.querySelector('[lang="en"]') && (copyBtn.querySelector('[lang="en"]').textContent = 'Copy address')
        copyBtn.querySelector('[lang="pt"]') && (copyBtn.querySelector('[lang="pt"]').textContent = 'Copiar endereço')
      }, 1500)
    }).catch(() => {})
  })
}

// ═══════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════

const app        = document.getElementById('app')
const sidebar    = document.getElementById('sidebar')
const toggleBtn  = document.getElementById('sidebar-toggle')
const homeRow    = document.getElementById('home-row')   // only on index.html
const subnav     = document.getElementById('subnav')     // only on index.html

// Sidebar state is in-memory only — does NOT persist across page navigations.
// This prevents the sidebar from appearing to "expand by itself" when you click
// a nav link to go to another page.

function openSidebar() {
  sidebar.classList.add('open')
  app.classList.add('sidebar-open')
  toggleBtn.setAttribute('aria-expanded', 'true')
}

function closeSidebar() {
  sidebar.classList.remove('open')
  app.classList.remove('sidebar-open')
  toggleBtn.setAttribute('aria-expanded', 'false')
  if (subnav) subnav.classList.remove('visible')
  if (homeRow) homeRow.classList.remove('expanded')
}

function openSubnav() {
  if (!subnav || !homeRow) return
  subnav.classList.add('visible')
  homeRow.classList.add('expanded')
  homeRow.setAttribute('aria-expanded', 'true')
}

function closeSubnav() {
  if (!subnav || !homeRow) return
  subnav.classList.remove('visible')
  homeRow.classList.remove('expanded')
  homeRow.setAttribute('aria-expanded', 'false')
}

// Sidebar always starts collapsed on every page load — no state restoration.

// Toggle sidebar on hamburger click only
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
      closeSidebar()
    } else {
      openSidebar()
    }
  })
}

// Toggle home subsections on homeRow click (only on index.html)
// Only responds to the chevron / label area when sidebar is open.
// When sidebar is closed, homeRow click does nothing extra — the button
// has no href so it's purely a toggle; user must open sidebar via hamburger first.
if (homeRow) {
  homeRow.addEventListener('click', () => {
    // Only toggle subnav when sidebar is already open
    if (!sidebar.classList.contains('open')) return
    if (homeRow.classList.contains('expanded')) {
      closeSubnav()
    } else {
      openSubnav()
    }
  })
}

// Smooth-scroll for subnav anchor links (index.html only)
document.querySelectorAll('.subnav-item[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault()
    const target = document.querySelector(a.getAttribute('href'))
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Update active state
    document.querySelectorAll('.subnav-item').forEach(s => s.classList.remove('active'))
    a.classList.add('active')
  })
})

// IntersectionObserver: highlight active subnav item while scrolling (index.html)
const sections = document.querySelectorAll('.editor[id]')
if (sections.length) {
  const scroller = document.getElementById('scroller')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id
        document.querySelectorAll('.subnav-item').forEach(s => {
          s.classList.toggle('active', s.dataset.section === id)
        })
      }
    })
  }, {
    root: scroller || null,
    rootMargin: '0px 0px -55% 0px',
    threshold: 0.05
  })

  sections.forEach(sec => observer.observe(sec))
}

// ═══════════════════════════════════════════
// LANGUAGE TOGGLE
// ═══════════════════════════════════════════
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

  // Restore saved preference
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'pt' || saved === 'en') setLang(saved)

  // Wire up buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.langTarget))
  })
})()
