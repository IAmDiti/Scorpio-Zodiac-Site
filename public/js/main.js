// main.js — starfield, date, horoscope, compat, share card

// ── STARS ────────────────────────────────────────────────
;(function(){
  const el = document.getElementById('stars')
  if (!el) return
  for (let i=0;i<110;i++){
    const s = document.createElement('div')
    s.className = 'star'
    const sz = Math.random()*1.8+0.3
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${3+Math.random()*5}s;animation-delay:${Math.random()*6}s`
    el.appendChild(s)
  }
})()

// ── DATE ─────────────────────────────────────────────────
;(function(){
  const el = document.getElementById('hdate')
  if (!el) return
  const D=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const M=['January','February','March','April','May','June','July','August','September','October','November','December']
  const n=new Date()
  el.textContent=`${D[n.getDay()]}, ${M[n.getMonth()]} ${n.getDate()}, ${n.getFullYear()}`
})()

// ── FOOTER YEAR ───────────────────────────────────────────
;(function(){ const el=document.getElementById('ftY'); if(el) el.textContent=new Date().getFullYear() })()

// ── HOROSCOPE ─────────────────────────────────────────────
let HZ = null

async function loadHoroscope() {
  const { ok, data } = await API.todayHoroscope()
  HZ = ok ? data.horoscope : null
  renderRings(HZ)
  renderCW(HZ)
  renderReading(HZ)
  if (HZ) drawCard(HZ)
}

function renderCW(h) {
  const el = document.getElementById('cw')
  if (!el) return
  const t = h?.cosmic_weather || '🌙 Moon in Scorpio · ♂ Mars in Aries · ♀ Venus direct'
  const parts = t.split('·').map(s=>s.trim())
  el.innerHTML = parts.map((p,i)=>
    `<span class="cw-i">${p}</span>${i<parts.length-1?'<span class="cw-d">·</span>':''}`
  ).join('')
}

function renderRings(h) {
  const keys = [{k:'love',c:'#9b7090'},{k:'career',c:'#6a7ea8'},{k:'health',c:'#7a8a6a'},{k:'spirit',c:'#8a7040'}]
  keys.forEach(({k}) => {
    const s = h?.[k+'_score'] || 0
    const n = document.getElementById('rn-'+k)
    const p = document.getElementById('rp-'+k)
    const c = document.getElementById('rc-'+k)
    if (n) n.textContent = s || '—'
    if (p) p.textContent = s ? s+'%' : '—'
    if (c && s) setTimeout(() => {
      c.style.transition = 'stroke-dashoffset 1s ease'
      c.style.strokeDashoffset = Math.round(107-(107*s/100))
    }, 400)
  })
}

function renderReading(h) {
  const loading = document.getElementById('rdLoading')
  const daily   = document.getElementById('tp-daily')
  if (loading) loading.style.display = 'none'
  // Don't touch display — CSS classes handle tab visibility

  const pill = document.getElementById('rdPill')
  const tabs = document.getElementById('tabs')
  const isUser = !!SZ

  if (pill) { pill.textContent = isUser ? 'Member' : 'Guest'; pill.classList.toggle('m', isUser) }
  if (tabs) tabs.classList.toggle('show', isUser)

  if (!h) {
    const el = document.getElementById('tp-daily')
    if (el) el.querySelector('#rdContent') && (el.querySelector('#rdContent').innerHTML =
      '<p class="reading" style="color:var(--textd);font-style:italic;text-align:center;padding:14px 0">No horoscope published yet. Check back soon.</p>')
    // Show generate button only for admin (your email)
    const ADMIN_EMAIL = 'ditidon@gmail.com'
    if (SZ && SZ.email === ADMIN_EMAIL) document.getElementById('generateBox')?.classList.remove('hidden')
    return
  }
  // Hide generate box when horoscope exists
  document.getElementById('generateBox')?.classList.add('hidden')

  const gp   = document.getElementById('guestPrev')
  const bg   = document.getElementById('blurGate')
  const full = document.getElementById('fullRead')
  const wk   = document.getElementById('weeklyC')
  const mo   = document.getElementById('monthlyC')

  if (!isUser) {
    const preview = (h.daily_overall||'').split('\n')[0]||''
    if (gp) gp.innerHTML = `<p class="reading">${preview}</p>`
    bg?.classList.remove('hidden')
    full?.classList.add('hidden')
    if (bg) { const bt = document.getElementById('blurTxt'); if(bt) bt.textContent=(h.daily_love||'')+' '+(h.daily_career||'') }
  } else {
    if (gp) gp.innerHTML = ''
    bg?.classList.add('hidden')
    if (full) { full.classList.remove('hidden'); full.innerHTML = buildDaily(h) }
    if (wk)   wk.innerHTML  = buildWeekly(h)
    if (mo)   mo.innerHTML   = buildMonthly(h)
  }
}

document.addEventListener('authReady', () => { if (HZ !== undefined) renderReading(HZ) })

// tab switching
document.addEventListener('click', e => {
  if (!e.target.classList.contains('tab')) return
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
  e.target.classList.add('active')
  // Update panels — remove active from all, add to target
  document.querySelectorAll('.tp').forEach(p => p.classList.remove('active'))
  const target = document.getElementById('tp-' + e.target.dataset.tab)
  if (target) target.classList.add('active')
})

function s(icon, title, text) {
  if (!text) return ''
  const ps = text.split('\n').filter(Boolean).map(p=>`<p class="reading mt">${p}</p>`).join('')
  return `<div style="margin-bottom:4px"><div class="rs-h"><span class="rs-ic">${icon}</span><span class="rs-t">${title}</span></div>${ps}</div><div class="div"></div>`
}

function buildDaily(h) {
  return `<div class="div"></div>
    ${s('✦','Overall Energy',h.daily_overall)}
    ${s('♥','Love & Relationships',h.daily_love)}
    ${s('◈','Career & Ambition',h.daily_career)}
    ${s('◉','Health & Body',h.daily_health)}
    ${s('☽','Spiritual Guidance',h.daily_spiritual)}
    <div class="lucky">
      <div class="li"><span class="ll">Numbers</span><span class="lv">${h.lucky_numbers||'—'}</span></div>
      <div class="li"><span class="ll">Color</span><span class="lv">${h.lucky_color||'—'}</span></div>
      <div class="li"><span class="ll">Crystal</span><span class="lv">${h.lucky_crystal||'—'}</span></div>
      <div class="li"><span class="ll">Best Hour</span><span class="lv">${h.best_hour||'—'}</span></div>
    </div>
    <div class="div"></div>
    <div class="aff"><div class="al">Today's Affirmation</div><p class="at">${h.affirmation||''}</p></div>
    <div class="ref"><div class="rl2">Reflection</div><p class="rt">${h.reflection||''}</p></div>`
}

function buildWeekly(h) {
  return `${s('✦','Week Overview',h.weekly_overview)}
    ${s('♥','Love This Week',h.weekly_love)}
    ${s('◈','Career This Week',h.weekly_career)}
    <div class="aff"><div class="al">Weekly Affirmation</div><p class="at">${h.weekly_affirmation||''}</p></div>
    <div class="ref"><div class="rl2">Reflection</div><p class="rt">${h.weekly_reflection||''}</p></div>`
}

function buildMonthly(h) {
  return `${s('✦','Monthly Overview',h.monthly_overview)}
    ${s('♥','Love This Month',h.monthly_love)}
    ${s('◈','Career & Finance',h.monthly_career)}
    <div class="lucky">
      <div class="li"><span class="ll">Power Dates</span><span class="lv">${h.monthly_power_dates||'—'}</span></div>
      <div class="li"><span class="ll">Theme</span><span class="lv">${h.monthly_theme||'—'}</span></div>
      <div class="li"><span class="ll">Crystal</span><span class="lv">${h.monthly_crystal||'—'}</span></div>
      <div class="li"><span class="ll">Mantra</span><span class="lv">${h.monthly_mantra||'—'}</span></div>
    </div>
    <div class="div"></div>
    <div class="aff"><div class="al">Monthly Affirmation</div><p class="at">${h.monthly_affirmation||''}</p></div>
    <div class="ref"><div class="rl2">Reflection</div><p class="rt">${h.monthly_reflection||''}</p></div>`
}

// ── COMPATIBILITY ─────────────────────────────────────────
const SIGNS=[
  {n:'Aries',e:'♈',s:72,p:85,t:60,i:70,g:78,ti:'Magnetic Tension',su:'Fire meets water — electric but complex',d:'Scorpio and Aries share Mars as a ruler, creating undeniable pull. The chemistry is electric, but both battle for control.'},
  {n:'Taurus',e:'♉',s:88,p:90,t:85,i:72,g:88,ti:'Fated Souls',su:'Opposite signs, divine attraction',d:'As opposite signs, Scorpio and Taurus share a profound, almost fated connection. Taurus gives the stability Scorpio craves.'},
  {n:'Gemini',e:'♊',s:55,p:65,t:45,i:80,g:55,ti:'Curious Chemistry',su:'Depth versus breadth creates friction',d:'Scorpio seeks depth; Gemini seeks variety. The intellectual spark is there but trust is elusive.'},
  {n:'Cancer',e:'♋',s:92,p:88,t:95,i:78,g:90,ti:'Soul Mates',su:'Water signs in profound harmony',d:'Perhaps the most intuitive pairing in the zodiac. Both water signs, they understand each other without words.'},
  {n:'Leo',e:'♌',s:65,p:88,t:55,i:68,g:62,ti:'Power Struggle',su:'Two intense signs, one stage',d:'The attraction is undeniable but power struggles emerge. Mutual respect is the key to this electric connection.'},
  {n:'Virgo',e:'♍',s:82,p:75,t:88,i:92,g:80,ti:'Deep Intellect',su:'Earth grounds water beautifully',d:'Virgo\'s precision meshes with Scorpio\'s investigative nature. Trust builds slowly but becomes unshakeable.'},
  {n:'Libra',e:'♎',s:60,p:72,t:55,i:75,g:58,ti:'Beautiful Contrast',su:'Balance seeks depth, depth resists',d:'Libra\'s desire for harmony can clash with Scorpio\'s intensity. Yet the attraction is very real.'},
  {n:'Scorpio',e:'♏',s:85,p:98,t:70,i:88,g:82,ti:'Mirror Souls',su:'Intense, transformative, consuming',d:'Two Scorpios — the most passionate bond imaginable. Transformative when it works; seismic when it doesn\'t.'},
  {n:'Sagittarius',e:'♐',s:58,p:75,t:50,i:72,g:65,ti:'Freedom vs Depth',su:'The eternal push and pull',d:'Sagittarius craves freedom; Scorpio craves deep commitment. Strong initial attraction but trust needs work.'},
  {n:'Capricorn',e:'♑',s:87,p:80,t:90,i:85,g:88,ti:'Power Couple',su:'Ambition and depth in perfect union',d:'A formidable pairing of depth and ambition. Both strategic, private, and intensely loyal once committed.'},
  {n:'Aquarius',e:'♒',s:52,p:60,t:48,i:88,g:55,ti:'Worlds Apart',su:'Emotion versus detachment',d:'Scorpio\'s emotional intensity can overwhelm Aquarius\'s need for independence. Extraordinary intellectual bond though.'},
  {n:'Pisces',e:'♓',s:90,p:92,t:88,i:80,g:92,ti:'Cosmic Union',su:'Two water signs, one ocean',d:'One of the most mystical, soulful connections in the zodiac. Both understand the unseen world intuitively.'},
]

;(function buildGrid(){
  const grid = document.getElementById('signsGrid')
  if (!grid) return
  SIGNS.forEach(sg => {
    const b = document.createElement('button')
    b.className = 'sb'
    b.innerHTML = `<span class="sg-">${sg.e}</span><span class="sn">${sg.n}</span>`
    b.onclick = () => showCompat(sg, b)
    grid.appendChild(b)
  })
})()

function showCompat(sg, btn) {
  document.querySelectorAll('.sb').forEach(b=>b.classList.remove('active'))
  btn.classList.add('active')
  const cr = document.getElementById('compatResult')
  if (!cr) return
  cr.classList.remove('show')
  void cr.offsetWidth

  document.getElementById('cpct').textContent  = sg.s+'%'
  document.getElementById('ctit').textContent  = `♏ + ${sg.e} ${sg.ti}`
  document.getElementById('csub').textContent  = sg.su
  document.getElementById('cdesc').textContent = sg.d

  const circ = document.getElementById('cc')
  circ.style.transition = 'none'
  circ.style.strokeDashoffset = '207'
  setTimeout(() => {
    circ.style.transition = 'stroke-dashoffset .9s ease'
    circ.style.strokeDashoffset = 207-(207*sg.s/100)
    document.getElementById('m1').style.width = sg.p+'%'
    document.getElementById('m2').style.width = sg.t+'%'
    document.getElementById('m3').style.width = sg.i+'%'
    document.getElementById('m4').style.width = sg.g+'%'
  }, 60)

  cr.classList.add('show')
}

// ── SHARE CARD ────────────────────────────────────────────
function drawCard(h) {
  const cv = document.getElementById('shareCanvas')
  if (!cv) return
  const ctx = cv.getContext('2d')
  const W = 1080, H = 1080
  cv.width = W; cv.height = H

  // Background
  const bg = ctx.createLinearGradient(0,0,W,H)
  bg.addColorStop(0,'#12101a'); bg.addColorStop(.5,'#1a1726'); bg.addColorStop(1,'#12101a')
  ctx.fillStyle = bg; ctx.fillRect(0,0,W,H)

  // Blobs
  const blob=(x,y,r,c)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
  blob(200,200,340,'#5c3a7222'); blob(880,800,280,'#7a405022')

  // Stars
  for(let i=0;i<80;i++){ctx.beginPath();ctx.arc(Math.random()*W,Math.random()*H,Math.random()*1.2+.2,0,Math.PI*2);ctx.fillStyle=`rgba(220,210,235,${.1+Math.random()*.35})`;ctx.fill()}

  // Border
  rr(ctx,24,24,W-48,H-48,24);ctx.strokeStyle='#2e2a4280';ctx.lineWidth=1;ctx.stroke()

  // Glyph
  ctx.font='80px serif';ctx.textAlign='center';ctx.fillStyle='#a897c8'
  ctx.shadowColor='#a897c840';ctx.shadowBlur=24;ctx.fillText('♏',W/2,210);ctx.shadowBlur=0

  // Title
  ctx.font='600 44px serif'
  const tg=ctx.createLinearGradient(W/2-180,0,W/2+180,0);tg.addColorStop(0,'#ddd5e8');tg.addColorStop(1,'#a897c8')
  ctx.fillStyle=tg;ctx.fillText('SCORPIO ZODIAC',W/2,272)

  // Date
  ctx.font='16px monospace';ctx.fillStyle='#c9a96e88'
  ctx.fillText((document.getElementById('hdate')?.textContent||'').toUpperCase(),W/2,308)

  // Divider
  const dg=ctx.createLinearGradient(240,0,840,0);dg.addColorStop(0,'transparent');dg.addColorStop(.5,'#3a354a');dg.addColorStop(1,'transparent')
  ctx.strokeStyle=dg;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(240,332);ctx.lineTo(840,332);ctx.stroke()

  // Cosmic weather
  const cw = h?.cosmic_weather || ''
  ctx.font='italic 18px monospace';ctx.fillStyle='#6b6384';ctx.textAlign='center'
  ctx.fillText(cw, W/2, 362)

  // Reading text — limit to 2 lines max
  const text = (h?.daily_overall||'Your cosmic truth awaits today, Scorpio.').split('\n')[0]
  const words = text.split(' ')
  let lines = [], line = ''
  ctx.font='italic 24px serif';ctx.fillStyle='#9d94b4'
  words.forEach(w => {
    const test = line + w + ' '
    if (ctx.measureText(test).width > 800 && line) { lines.push(line.trim()); line = w + ' ' }
    else line = test
  })
  if (line) lines.push(line.trim())
  lines = lines.slice(0, 3) // max 3 lines
  const textStartY = 420
  lines.forEach((l, i) => { ctx.textAlign='center'; ctx.fillText(l, W/2, textStartY + i*36) })

  // Affirmation box
  const affY = 560
  ctx.fillStyle='#1e1a3088'
  rr(ctx,120,affY,840,80,12); ctx.fill()
  ctx.strokeStyle='#7a6d9a50';ctx.lineWidth=1;rr(ctx,120,affY,840,80,12);ctx.stroke()
  ctx.font='italic 20px serif';ctx.fillStyle='#a897c8';ctx.textAlign='center'
  const aff = (h?.affirmation||'').replace(/^"|"$/g,'')
  ctx.fillText(`"${aff.substring(0,80)}"`, W/2, affY+48)

  // Energy rings — evenly spread
  const rings = [{l:'Love',v:h?.love_score||75,c:'#9b7090'},{l:'Career',v:h?.career_score||70,c:'#6a7ea8'},{l:'Health',v:h?.health_score||72,c:'#7a8a6a'},{l:'Spirit',v:h?.spirit_score||80,c:'#8a7040'}]
  const ringY = 760, spacing = 200, startX = 140
  rings.forEach((e,i) => {
    const cx = startX + i*spacing, r = 40
    // Ring track
    ctx.beginPath();ctx.arc(cx,ringY,r,0,Math.PI*2);ctx.strokeStyle='#2e2a42';ctx.lineWidth=6;ctx.stroke()
    // Ring fill
    ctx.beginPath();ctx.arc(cx,ringY,r,-Math.PI/2,-Math.PI/2+(Math.PI*2*e.v/100))
    ctx.strokeStyle=e.c;ctx.lineWidth=6;ctx.lineCap='round';ctx.stroke()
    // Score
    ctx.font='bold 20px serif';ctx.fillStyle='#ddd5e8';ctx.textAlign='center'
    ctx.fillText(e.v+'%',cx,ringY+7)
    // Label
    ctx.font='13px monospace';ctx.fillStyle='#6b6384'
    ctx.fillText(e.l.toUpperCase(),cx,ringY+r+20)
  })

  // Divider
  ctx.strokeStyle=dg;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(240,870);ctx.lineTo(840,870);ctx.stroke()

  // Footer
  ctx.font='13px monospace';ctx.fillStyle='#3a354a80';ctx.textAlign='center'
  ctx.fillText('scorpiozodiac.com',W/2,920)
}

function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath()}
function wt(ctx,text,x,y,mw,lh){const words=text.split(' ');let line='';for(let i=0;i<words.length;i++){const t=line+words[i]+' ';if(ctx.measureText(t).width>mw&&i>0){ctx.textAlign='center';ctx.fillText(line,540,y);line=words[i]+' ';y+=lh}else line=t}ctx.textAlign='center';ctx.fillText(line,540,y)}

function downloadCard() {
  if (HZ) drawCard(HZ)
  const a=document.createElement('a');a.download='scorpio-'+Date.now()+'.png';a.href=document.getElementById('shareCanvas').toDataURL();a.click()
  toast('Downloaded ✦')
}

function copyCaption() {
  const date = document.getElementById('hdate')?.textContent||'today'
  const text = `♏ My Scorpio reading for ${date}\n\n"${HZ?.daily_overall?.split('\n')[0]||'Your cosmic truth awaits.'}"\n\n✦ scorpiozodiac.com`
  navigator.clipboard.writeText(text).then(()=>toast('Caption copied ✦'))
}

// load after auth check
document.addEventListener('authReady', loadHoroscope, { once: true })

// ── GENERATE HOROSCOPE ────────────────────────────────────
async function generateHoroscope() {
  const btn = document.getElementById('generateBtn')
  if (btn) { btn.textContent = '⏳ Generating... (~15 sec)'; btn.disabled = true }

  const { ok, data, error } = await API.generateHoroscope()

  if (ok && data.horoscope) {
    HZ = data.horoscope
    document.getElementById('generateBox')?.classList.add('hidden')
    renderRings(HZ)
    renderCW(HZ)
    renderReading(HZ)
    drawCard(HZ)
    toast('✦ Horoscope generated!')
  } else {
    if (btn) { btn.textContent = '✦ Generate Today\'s Horoscope'; btn.disabled = false }
    alert('Error: ' + (error || 'Could not generate. Check your ANTHROPIC_API_KEY in .env'))
  }
}
