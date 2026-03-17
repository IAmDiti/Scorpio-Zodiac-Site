// api.js — every server call goes through here
const API = {
  async req(method, url, body) {
    try {
      const opts = { method, credentials: 'include', headers: { 'Content-Type': 'application/json' } }
      if (body) opts.body = JSON.stringify(body)
      const r = await fetch(url, opts)
      const d = await r.json()
      return { ok: r.ok, data: d, error: r.ok ? null : (d.error || 'Something went wrong') }
    } catch (e) {
      return { ok: false, data: null, error: 'Cannot reach server. Is it running?' }
    }
  },
  signup(name, email, password, birthDate) { return this.req('POST', '/api/auth/signup', { name, email, password, birthDate }) },
  login(email, password)                   { return this.req('POST', '/api/auth/login',  { email, password }) },
  logout()                                 { return this.req('POST', '/api/auth/logout') },
  me()                                     { return this.req('GET',  '/api/auth/me') },
  updateProfile(data)                      { return this.req('PUT',  '/api/auth/profile', data) },
  forgotPassword(email)                    { return this.req('POST', '/api/auth/forgot-password', { email }) },
  googleUrl()                              { return this.req('GET',  '/api/auth/google-url') },
  googleToken(access_token)               { return this.req('POST', '/api/auth/google-token', { access_token }) },
  todayHoroscope()                         { return this.req('GET',  '/api/horoscope/today') },
  generateHoroscope()                      { return this.req('POST', '/api/horoscope/generate') },
  personalToday()                          { return this.req('GET',  '/api/personal/today') },
  personalChart()                          { return this.req('GET',  '/api/personal/chart') },
  posts(limit)                             { return this.req('GET',  `/api/blog/posts?limit=${limit||10}`) },
  post(slug)                               { return this.req('GET',  `/api/blog/posts/${slug}`) },
}
