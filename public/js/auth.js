// auth.js — login state, modal, dropdown, profile
let SZ = null  // current user — null = guest

// ── reCAPTCHA site key — replace with your real key ─────
const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY'

// ── Get reCAPTCHA token ───────────────────────────────────
async function getRecaptchaToken(action) {
  return new Promise((resolve) => {
    if (typeof grecaptcha === 'undefined' || !RECAPTCHA_SITE_KEY || RECAPTCHA_SITE_KEY === 'YOUR_RECAPTCHA_SITE_KEY') {
      resolve(null) // skip if not configured
      return
    }
    grecaptcha.ready(() => {
      grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
        .then(token => resolve(token))
        .catch(() => resolve(null))
    })
  })
}

// ── init ────────────────────────────────────────────────
async function initAuth() {
  const { ok, data } = await API.me()
  SZ = (ok && data.user) ? data.user : null
  SZ ? renderUser(SZ) : renderGuest()
  document.dispatchEvent(new CustomEvent('authReady', { detail: SZ }))
}

// ── nav ─────────────────────────────────────────────────
function renderGuest() {
  const el = document.getElementById('navRight')
  if (!el) return
  el.innerHTML = `
    <button class="btn btn-o" onclick="openModal('login')">Sign In</button>
    <button class="btn btn-f" onclick="openModal('signup')">Join Free</button>`
}

function renderUser(u) {
  const el = document.getElementById('navRight')
  if (!el) return
  el.innerHTML = `
    <div class="pdw">
      <button class="pdp" onclick="toggleDrop()">
        <div class="pda">♏</div>
        <span class="pdn">${esc(u.name||u.email)}</span>
        <span class="pdc" id="pdc">▾</span>
      </button>
      <div class="pdm" id="pdm">
        <div class="pdh">
          <div class="pdha">♏</div>
          <div><div class="pdhn">${esc(u.name||'')}</div><div class="pdhe">${esc(u.email||'')}</div></div>
        </div>
        <div class="pdd"></div>
        <a href="/" class="pdi">🌑 &nbsp;My Horoscope</a>
        <button class="pdi" onclick="openProfileModal()">✦ &nbsp;Edit Profile</button>
        <div class="pdd"></div>
        <button class="pdi red" onclick="doLogout()">↩ &nbsp;Log Out</button>
      </div>
    </div>`
  // close on outside click
  setTimeout(() => document.addEventListener('click', outsideClick), 20)
}

function toggleDrop() {
  const m = document.getElementById('pdm')
  const c = document.getElementById('pdc')
  if (!m) return
  const open = m.classList.toggle('open')
  c && c.classList.toggle('open', open)
}

function outsideClick(e) {
  const w = document.querySelector('.pdw')
  if (w && !w.contains(e.target)) {
    document.getElementById('pdm')?.classList.remove('open')
    document.getElementById('pdc')?.classList.remove('open')
  }
}

// ── modal helpers ────────────────────────────────────────
function openModal(tab) {
  clearMsgs()
  document.getElementById('authModal')?.classList.add('open')
  switchTab(tab || 'login')
}
function closeModal() {
  document.getElementById('authModal')?.classList.remove('open')
  clearMsgs()
}
function switchTab(t) {
  ;['fLogin','fSignup','fForgot'].forEach(id => document.getElementById(id)?.classList.add('hidden'))
  document.getElementById(t === 'login' ? 'fLogin' : t === 'signup' ? 'fSignup' : 'fForgot')?.classList.remove('hidden')
  document.getElementById('sw1')?.classList.toggle('active', t === 'login')
  document.getElementById('sw2')?.classList.toggle('active', t === 'signup')
  clearMsgs()
}

// ── profile modal ────────────────────────────────────────
function openProfileModal() {
  document.getElementById('pdm')?.classList.remove('open')
  if (SZ) {
    setVal('pName',  SZ.name  || '')
    setVal('pEmail', SZ.email || '')
    setVal('pBirth', SZ.birth_date || '')
    setVal('pPass',  '')
    setVal('pPass2', '')
  }
  clearMsgs()
  document.getElementById('profModal')?.classList.add('open')
}
function closeProfileModal() {
  document.getElementById('profModal')?.classList.remove('open')
  clearMsgs()
}

// ── actions ──────────────────────────────────────────────
// ── GOOGLE LOGIN ──────────────────────────────────────────
async function doGoogleLogin() {
  const { ok, data, error } = await API.req('GET', '/api/auth/google-url')
  if (ok && data.url) {
    window.location.href = data.url
  } else {
    toast('Google login not configured yet.')
  }
}

async function doSignup() {
  clearMsgs()
  const name  = g('sName'), email = g('sEmail'), pass = g('sPass'), birth = g('sBirth')
  if (!name)        return err('sErr', 'Please enter your name.')
  if (!email)       return err('sErr', 'Please enter your email.')
  if (pass.length < 6) return err('sErr', 'Password needs at least 6 characters.')

  // Scorpio-only gate — check birth date if provided
  if (birth) {
    const month = new Date(birth).getUTCMonth() + 1
    const day   = new Date(birth).getUTCDate()
    const isScorpio = (month === 10 && day >= 23) || (month === 11 && day <= 21)
    if (!isScorpio) {
      return err('sErr', 'This platform is exclusively for Scorpio (Oct 23 – Nov 21).')
    }
  }

  loading('btnSignup', 'Checking...')

  // reCAPTCHA v3 — invisible check
  const token = await getRecaptchaToken('signup')
  if (token) {
    const { ok, data } = await API.req('POST', '/api/auth/verify-captcha', { token })
    if (!ok || (data.score !== undefined && data.score < 0.5)) {
      loading('btnSignup', 'Begin My Journey')
      return err('sErr', 'Security check failed. Please try again.')
    }
  }

  loading('btnSignup', 'Creating account...')
  const { ok, data, error } = await API.signup(name, email, pass, birth)
  loading('btnSignup', 'Begin My Journey')
  if (ok) { SZ = data.user; renderUser(SZ); closeModal(); toast('Welcome ✦ ' + SZ.name); fire() }
  else err('sErr', error)
}

async function doLogin() {
  clearMsgs()
  const email = g('lEmail'), pass = g('lPass')
  if (!email) return err('lErr', 'Please enter your email.')
  if (!pass)  return err('lErr', 'Please enter your password.')
  loading('btnLogin', 'Signing in...')
  const { ok, data, error } = await API.login(email, pass)
  loading('btnLogin', 'Enter ♏')
  if (ok) { SZ = data.user; renderUser(SZ); closeModal(); toast('Welcome back ✦ ' + SZ.name); fire() }
  else err('lErr', error)
}

async function doLogout() {
  await API.logout()
  SZ = null
  document.removeEventListener('click', outsideClick)
  closeProfileModal()
  renderGuest()
  toast('See you in the cosmos ♏')
  fire()
}

async function doForgot() {
  clearMsgs()
  const email = g('fEmail')
  if (!email) return err('fErr', 'Please enter your email.')
  loading('btnForgot', 'Sending...')
  const { ok, error } = await API.forgotPassword(email)
  loading('btnForgot', 'Send Reset Link')
  ok ? ok2('fOk', '✦ Check your email! (dev: check server terminal)') : err('fErr', error)
}

async function doSaveProfile() {
  clearMsgs()
  const name = g('pName'), email = g('pEmail'), birth = g('pBirth'), pass = g('pPass'), pass2 = g('pPass2')
  if (!name)  return err('pErr', 'Name is required.')
  if (!email) return err('pErr', 'Email is required.')
  if (pass && pass !== pass2) return err('pErr', 'Passwords do not match.')
  const body = { name, email, birthDate: birth }
  if (pass) body.newPassword = pass
  loading('btnProf', 'Saving...')
  const { ok, data, error } = await API.updateProfile(body)
  loading('btnProf', 'Save Changes ✦')
  if (ok) { SZ = data.user; renderUser(SZ); ok2('pOk', '✦ Profile saved!'); toast('Saved ✦') }
  else err('pErr', error)
}

// ── util ─────────────────────────────────────────────────
function g(id)          { return (document.getElementById(id)?.value || '').trim() }
function setVal(id, v)  { const el = document.getElementById(id); if (el) el.value = v }
function esc(s)         { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
function err(id, msg)   { const el = document.getElementById(id); if (el) { el.textContent = msg; el.classList.remove('hidden') } }
function ok2(id, msg)   { const el = document.getElementById(id); if (el) { el.textContent = msg; el.classList.remove('hidden') } }
function clearMsgs()    { document.querySelectorAll('.err,.okm').forEach(e => { e.classList.add('hidden'); e.textContent = '' }) }
function loading(id, t) { const el = document.getElementById(id); if (el) { el.textContent = t; el.disabled = t.includes('...') } }
function fire()         { document.dispatchEvent(new CustomEvent('authReady', { detail: SZ })) }
function toast(msg) {
  const t = document.getElementById('toast')
  if (!t) return
  t.textContent = msg; t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 3200)
}

// close modals on backdrop click
document.addEventListener('click', e => {
  if (e.target.id === 'authModal')  closeModal()
  if (e.target.id === 'profModal')  closeProfileModal()
})

// enter key in modal
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return
  if (!document.getElementById('authModal')?.classList.contains('open')) return
  if (!document.getElementById('fLogin')?.classList.contains('hidden'))  doLogin()
  if (!document.getElementById('fSignup')?.classList.contains('hidden')) doSignup()
  if (!document.getElementById('fForgot')?.classList.contains('hidden')) doForgot()
})

initAuth()
