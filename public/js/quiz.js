// quiz.js — all 4 quizzes

const QUIZZES = {
  archetype: {
    icon:'🦂', title:"Which Face of Scorpio Are You?",
    sub:"Every Scorpio contains multitudes — but one archetype tends to dominate. 8 questions. No wrong answers.",
    previews:['🔥 The Phoenix','🌑 The Shadow','🔮 The Mystic','⚗️ The Alchemist'],
    type:'key',
    questions:[
      {q:"When something wounds you deeply, your first instinct is:",opts:[{t:"Retreat and process until I'm reborn stronger",k:'phoenix'},{t:"Understand exactly what happened and who is responsible",k:'shadow'},{t:"Search for the deeper spiritual meaning in the pain",k:'mystic'},{t:"Immediately begin transforming the wound into something useful",k:'alchemist'}]},
      {q:"You feel most powerfully yourself:",opts:[{t:"After something ends — fresh starts energize me",k:'phoenix'},{t:"Alone in the dark, with no performance required",k:'shadow'},{t:"In liminal spaces — between worlds, between states",k:'mystic'},{t:"Deep in meaningful creative or intellectual work",k:'alchemist'}]},
      {q:"People consistently misunderstand you because:",opts:[{t:"They think I'm broken — they don't see how much I've rebuilt",k:'phoenix'},{t:"They find me unsettling without knowing why",k:'shadow'},{t:"They think I'm distant when I'm actually seeing more",k:'mystic'},{t:"They think I'm obsessive when I'm mid-transformation",k:'alchemist'}]},
      {q:"Your greatest strength is:",opts:[{t:"Resilience — I rise from what would destroy most people",k:'phoenix'},{t:"Perception — I see what others cannot or will not",k:'shadow'},{t:"Intuition — I know things before I can explain how",k:'mystic'},{t:"Transmutation — I make everything I touch more powerful",k:'alchemist'}]},
      {q:"When you sense someone lying to you:",opts:[{t:"Let it play out — I've survived worse betrayals",k:'phoenix'},{t:"Quietly gather evidence until I know everything",k:'shadow'},{t:"Trust my energy read and create distance",k:'mystic'},{t:"Confront it — lies contaminate everything they touch",k:'alchemist'}]},
      {q:"Your deepest fear is:",opts:[{t:"That this time, I won't rise again",k:'phoenix'},{t:"That I will destroy something I actually love",k:'shadow'},{t:"That I am too much for this world to hold",k:'mystic'},{t:"That my work will remain unfinished",k:'alchemist'}]},
      {q:"You approach love:",opts:[{t:"Completely — I'll love you through every version of yourself",k:'phoenix'},{t:"Carefully — I need to know your shadows first",k:'shadow'},{t:"Spiritually — I believe souls choose each other",k:'mystic'},{t:"Deeply — love is the most powerful transformation there is",k:'alchemist'}]},
      {q:"The love you offer is:",opts:[{t:"Total devotion through every version of you",k:'phoenix'},{t:"Unflinching honesty — I will never pretend",k:'shadow'},{t:"Spiritual recognition — I see your soul",k:'mystic'},{t:"Catalytic — loving me will change you for the better",k:'alchemist'}]},
    ],
    results:{
      phoenix:{icon:'🔥',title:'The Phoenix',sub:'You are Scorpio in its most triumphant expression — the one who rises.',traits:['Resilience','Courage','Rebirth','Endurance'],body:"You have been tested in ways that leave marks most people never carry. And yet here you are — not despite those experiences, but because of them. The Phoenix Scorpio transforms suffering into fuel.\n\nYour greatest gift is proof. Your existence shows others it's possible to lose everything and rebuild. People are drawn to you because they sense something they desperately need: evidence that they will survive their own fires."},
      shadow:{icon:'🌑',title:'The Shadow',sub:'You are Scorpio at its most perceptive — the one who sees in the dark.',traits:['Perception','Depth','Truth-seeking','Power'],body:"You see what others choose not to see. The Shadow Scorpio perceives the truth beneath surfaces — real motivations, hidden dynamics, the wound beneath the performance.\n\nPeople are often unnerved by you without knowing why. What they sense is that you cannot be fooled, and that your presence removes the option of pretense. This makes you invaluable to those brave enough to seek genuine connection."},
      mystic:{icon:'🔮',title:'The Mystic',sub:'You are Scorpio at its most spiritually attuned — the one who perceives beyond.',traits:['Intuition','Depth','Spiritual sight','Mystery'],body:"You have always existed slightly outside ordinary reality — not disconnected, but perceiving dimensions others cannot access. The Mystic Scorpio experiences the world as layered, symbolic, deeply meaningful.\n\nYou are drawn to the liminal: thresholds, transitions, the spaces between states of being. Death and rebirth are not metaphors to you — they are lived experiences you have passed through multiple times."},
      alchemist:{icon:'⚗️',title:'The Alchemist',sub:'You are Scorpio at its most creative — the one who transforms everything they touch.',traits:['Transformation','Focus','Creation','Mastery'],body:"You are driven to take raw material — experience, pain, ideas — and transmute it into something greater. The Alchemist Scorpio is the artist, the strategist, the healer. Whatever you do, you do with total concentration.\n\nOthers call you obsessive, and they're right — but they misunderstand. You're not attached to outcomes. You're attached to the sacred process of transformation itself."},
    }
  },

  score: {
    icon:'⚡', title:'How Scorpio Are You Really?',
    sub:"Not everyone with a Scorpio sun lives the full intensity. Answer honestly — this quiz doesn't reward performance.",
    previews:['0–40 Scorpio Adjacent','41–70 True Scorpio','71–89 Scorpio Dominant','90–100 Pure Scorpio'],
    type:'score',
    questions:[
      {q:"You discover a close friend has been lying to you for months:",opts:[{t:"I'd feel hurt but forgive quickly",p:2},{t:"I'd need time but eventually move on",p:5},{t:"I would never fully trust them again",p:8},{t:"I already knew. I was waiting to see how long they'd continue",p:10}]},
      {q:"How often do you feel emotions at an intensity others don't match?",opts:[{t:"Rarely — I'm generally balanced",p:2},{t:"Sometimes — in high-stakes situations",p:5},{t:"Often — I feel things more deeply than most",p:8},{t:"Always — I've never met anyone who feels as intensely as I do",p:10}]},
      {q:"When you're interested in something:",opts:[{t:"I explore it casually alongside other interests",p:2},{t:"I get quite into it for a while",p:5},{t:"I dive deep until I understand it completely",p:8},{t:"I become completely consumed until it's mastered or exhausted",p:10}]},
      {q:"How do you feel about small talk?",opts:[{t:"I enjoy it — light connection is still connection",p:2},{t:"It's fine in small doses",p:4},{t:"I tolerate it but it drains me",p:7},{t:"It feels like slow torture — I'd rather have silence than shallow conversation",p:10}]},
      {q:"Your relationship with secrets:",opts:[{t:"I don't really keep or seek them out",p:2},{t:"I keep my own private things private",p:5},{t:"People tell me things they've never told anyone",p:8},{t:"I am a vault. I carry more than anyone knows",p:10}]},
      {q:"How many times have you fundamentally reinvented yourself?",opts:[{t:"Once or not at all",p:2},{t:"Twice — after a major life event",p:5},{t:"Three or four times",p:8},{t:"I've lost count. I'm unrecognizable from who I was five years ago",p:10}]},
      {q:"When you love someone:",opts:[{t:"Warm and consistent",p:2},{t:"Deep and loyal",p:6},{t:"Intense — I give everything",p:8},{t:"Total. I would do anything for the people I've truly chosen",p:10}]},
      {q:"Your intuition about people:",opts:[{t:"Hit or miss like everyone else",p:2},{t:"Usually right about important things",p:5},{t:"Rarely wrong — I read people quickly and accurately",p:8},{t:"Essentially infallible. I know who someone is within minutes",p:10}]},
      {q:"How do you handle your anger?",opts:[{t:"I express it and move on fairly quickly",p:2},{t:"I hold it for a while then release it",p:5},{t:"I bury it deep and process privately",p:8},{t:"I'm strategic. Anger is information — I decide how and when to use it",p:10}]},
      {q:"How comfortable are you with darkness — in yourself and in life?",opts:[{t:"I prefer to focus on the positive",p:2},{t:"I can face it when I need to",p:5},{t:"I'm not afraid of it — I've explored my own shadows",p:8},{t:"Darkness is not my enemy — it's where I do my most important work",p:10}]},
    ],
    tiers:[
      {min:0,max:40,tag:'Scorpio Adjacent',title:'The Gentle Depth',color:'#6a7ea8',body:"You carry Scorpio energy but express it softly. Other chart placements soften its intensity — this doesn't diminish you. You access Scorpio's gifts of perception and depth without being consumed by its shadow."},
      {min:41,max:70,tag:'True Scorpio',title:'The Authentic Depth',color:'#9b7090',body:"You embody core Scorpio qualities — depth, loyalty, perception, emotional intensity — in a balanced way. You feel things deeply, read people accurately, and have undergone genuine transformation."},
      {min:71,max:89,tag:'Scorpio Dominant',title:'The Intense One',color:'#c49aac',body:"Scorpio is not just your sun sign — it's your entire gravitational field. You don't just have Scorpio traits, you live them fully. The challenge is remembering that not everyone can meet you at this depth."},
      {min:90,max:100,tag:'Pure Scorpio',title:'The Undiluted One',color:'#ffd700',body:"A score in this range is uncommon. Scorpio permeates your chart, psychology, and lived experience. You have undergone losses that would break most people and emerged transformed. Your perception of others borders on the supernatural."},
    ]
  },

  love: {
    icon:'♥', title:"What's Your Scorpio Love Style?",
    sub:"Scorpio loves with totality — but the shape of that love differs. 8 questions reveal which style is yours.",
    previews:['🛡 The Protector','🔥 The Pursuer','🌙 The Devotee','⚗️ The Transformer'],
    type:'key',
    questions:[
      {q:"When you fall for someone, the first thing you feel is:",opts:[{t:"A fierce desire to keep them safe from everything",k:'protector'},{t:"An all-consuming need to know everything about them",k:'pursuer'},{t:"A quiet certainty — patience to let it unfold",k:'devotee'},{t:"An intense awareness that this person will change you",k:'transformer'}]},
      {q:"In a long-term relationship you value most:",opts:[{t:"Being the person they turn to when everything falls apart",k:'protector'},{t:"Maintaining the intensity — I need to still feel the pull",k:'pursuer'},{t:"Building a private world no one else has access to",k:'devotee'},{t:"Growing and changing together — stagnation kills love",k:'transformer'}]},
      {q:"Your greatest fear in love:",opts:[{t:"That I won't be able to protect them from what matters",k:'protector'},{t:"That the intensity will fade into something ordinary",k:'pursuer'},{t:"That they will leave — slowly, before I even notice",k:'devotee'},{t:"That they won't go through the transformations with me",k:'transformer'}]},
      {q:"You express love most naturally through:",opts:[{t:"Acts — showing up, solving problems, being a constant",k:'protector'},{t:"Attention — my full undivided focus on everything they are",k:'pursuer'},{t:"Loyalty — being the one constant in a changing world",k:'devotee'},{t:"Depth — pushing them toward their truest self",k:'transformer'}]},
      {q:"The love you offer is:",opts:[{t:"A shield — I will stand between you and anything that threatens you",k:'protector'},{t:"A fire — you will never feel ordinary when I'm focused on you",k:'pursuer'},{t:"A root — I'm not going anywhere, easy or hard",k:'devotee'},{t:"A catalyst — loving me will change you. It will be worth it",k:'transformer'}]},
      {q:"When a relationship ends you:",opts:[{t:"Carry a protective concern for them long after",k:'protector'},{t:"Find the withdrawal nearly unbearable",k:'pursuer'},{t:"Grieve privately and completely before letting anyone else in",k:'devotee'},{t:"Examine it until you understand exactly what it changed in you",k:'transformer'}]},
      {q:"What your ideal partner understands about you:",opts:[{t:"My protectiveness comes from love, not control",k:'protector'},{t:"My intensity is something to match, not manage",k:'pursuer'},{t:"My loyalty is absolute — I need theirs to be the same",k:'devotee'},{t:"I will love them better after every difficult conversation",k:'transformer'}]},
      {q:"Your relationship with jealousy:",opts:[{t:"Protective — I guard what matters to me",k:'protector'},{t:"Intense — when I want someone, I want them completely",k:'pursuer'},{t:"Quiet — I hold it and try to understand where it comes from",k:'devotee'},{t:"Informative — I use it to understand what I truly value",k:'transformer'}]},
    ],
    results:{
      protector:{icon:'🛡',title:'The Devoted Protector',sub:'You love by standing between your person and the world.',traits:['Fiercely loyal','Deeply caring','Quietly powerful','Steadfast'],compat:'Best matched with: Cancer, Capricorn, Taurus',body:"Your love language is protection. When you love someone you feel a bone-deep responsibility for their wellbeing. You sacrifice enormous things for those you've chosen, often without telling them.\n\nPartners feel extraordinarily safe with you. There's a quality of absolute reliability in how you love — they know you won't leave, won't betray them, and will show up in ways most people only imagine."},
      pursuer:{icon:'🔥',title:'The Intense Pursuer',sub:'You love by bringing every part of yourself to bear on one person.',traits:['Magnetically intense','Passionately focused','All-or-nothing','Electrifying'],compat:'Best matched with: Pisces, Scorpio, Leo',body:"When you love, you pursue. Your full attention, curiosity, and desire become directed toward one person with extraordinary focus. Being loved by you is an experience unlike anything else.\n\nThe challenge is sustaining this without it becoming consuming. The Pursuer loves most powerfully when they learn that depth, not just intensity, sustains a relationship across years."},
      devotee:{icon:'🌙',title:'The Slow-Burn Devotee',sub:'You love slowly, completely, and without an exit strategy.',traits:['Quietly devoted','Enduringly loyal','Emotionally deep','Patient'],compat:'Best matched with: Virgo, Capricorn, Cancer',body:"You don't fall fast — you fall permanently. The Slow-Burn Devotee takes time to open, but once they do, the commitment is total.\n\nPartners who earn your love receive something rare: a devotion that doesn't waver when life becomes hard. Your shadow is the fear of abandonment that can make you hold on past the point of health."},
      transformer:{icon:'⚗️',title:'The Transformative Lover',sub:'You love by changing, and being changed by, everything that matters.',traits:['Deeply catalytic','Psychologically perceptive','Growth-oriented','Profound'],compat:'Best matched with: Pisces, Sagittarius, Aquarius',body:"You believe love is the most powerful transformative force available. You are not interested in love that leaves you the same.\n\nBeing loved by a Transformative Scorpio is one of the most significant experiences of a person's life. You see your partner's potential and their shadows — and you love both."},
    }
  },

  planet: {
    icon:'🪐', title:'Which Planet Rules Your Emotions?',
    sub:"Your sun sign tells one story. The planet that rules your emotional world tells another — often the truer one.",
    previews:['☉ Sun','☽ Moon','♂ Mars','♀ Venus','♃ Jupiter','♄ Saturn','♇ Pluto'],
    type:'key',
    questions:[
      {q:"When you feel a strong emotion, where do you feel it in your body?",opts:[{t:"In my chest — a warmth or burn",k:'sun'},{t:"In my stomach — a deep fluctuating tide",k:'moon'},{t:"In my muscles — tension and restlessness",k:'mars'},{t:"In my throat — an ache to express and connect",k:'venus'},{t:"Everywhere — it expands beyond my body",k:'jupiter'},{t:"In my bones — a heavy structural weight",k:'saturn'},{t:"In my core — a pressure that builds until transformation",k:'pluto'}]},
      {q:"The emotion you visit most often:",opts:[{t:"Quiet pride — baseline confidence in who I am",k:'sun'},{t:"Gentle longing — for home, safety, what was",k:'moon'},{t:"Restless hunger — I want more, I want to fight",k:'mars'},{t:"Tender appreciation — I feel beauty constantly",k:'venus'},{t:"Expansive hope — things can always be better",k:'jupiter'},{t:"Serious weight — I feel the gravity of responsibility",k:'saturn'},{t:"Deep awareness of impermanence — I feel undercurrents",k:'pluto'}]},
      {q:"In your closest relationships you need:",opts:[{t:"To be seen and recognized for who you truly are",k:'sun'},{t:"Emotional safety — to feel nurtured and at home",k:'moon'},{t:"Honesty and directness — no pretense",k:'mars'},{t:"Warmth, beauty, and reciprocal appreciation",k:'venus'},{t:"Freedom, expansion, and shared adventures",k:'jupiter'},{t:"Reliability, structure, and earned trust",k:'saturn'},{t:"Total depth and willingness to transform together",k:'pluto'}]},
      {q:"Your emotional superpower:",opts:[{t:"Confidence — I believe in myself even when conditions aren't ideal",k:'sun'},{t:"Empathy — I feel what others feel with extraordinary accuracy",k:'moon'},{t:"Courage — I act on my feelings even when terrified",k:'mars'},{t:"Warmth — people feel genuinely loved around me",k:'venus'},{t:"Optimism — I find hope where others see only difficulty",k:'jupiter'},{t:"Resilience — I have outlasted every emotional storm",k:'saturn'},{t:"Depth — I experience the full range of human feeling",k:'pluto'}]},
      {q:"How do you process grief?",opts:[{t:"By integrating it into my story",k:'sun'},{t:"By feeling every wave fully",k:'moon'},{t:"Through action — moving my body, fighting something",k:'mars'},{t:"Through connection — I need to grieve near people I love",k:'venus'},{t:"By finding the larger meaning — it must teach me something",k:'jupiter'},{t:"Through endurance — I carry it and wait for it to become strength",k:'saturn'},{t:"By descending into it and emerging fundamentally changed",k:'pluto'}]},
      {q:"At the end of a deeply meaningful day you feel:",opts:[{t:"Satisfied — I was fully myself",k:'sun'},{t:"Held — connected to people and places I love",k:'moon'},{t:"Alive — I did something real and felt it",k:'mars'},{t:"Full — there was beauty and I received it",k:'venus'},{t:"Expanded — I learned something that makes the world larger",k:'jupiter'},{t:"Earned — I worked for something building toward what matters",k:'saturn'},{t:"Changed — I am not quite the same person who woke up",k:'pluto'}]},
      {q:"The emotion hardest to sit with:",opts:[{t:"Invisibility — not being seen or acknowledged",k:'sun'},{t:"Disconnection — feeling emotionally alone",k:'moon'},{t:"Powerlessness — having no way to act",k:'mars'},{t:"Ugliness — internal conflict or wrongness",k:'venus'},{t:"Confinement — restriction and limitation",k:'jupiter'},{t:"Chaos — disorder and absence of structure",k:'saturn'},{t:"Superficiality — anything that refuses depth",k:'pluto'}]},
      {q:"When you're at your most powerful you feel:",opts:[{t:"Radiant — fully myself, visible and unashamed",k:'sun'},{t:"Deeply attuned — to the emotional needs of everyone around me",k:'moon'},{t:"Unstoppable — focused and cutting through everything",k:'mars'},{t:"Beautiful — connected and in harmony with the world",k:'venus'},{t:"Expansive — full of vision and infectious optimism",k:'jupiter'},{t:"Unshakeable — structured and mastering my discipline",k:'saturn'},{t:"Transformative — changing something that will never go back",k:'pluto'}]},
      {q:"Your relationship with power:",opts:[{t:"I believe in the power of authentic self-expression",k:'sun'},{t:"I prefer emotional influence over direct control",k:'moon'},{t:"I take action and let results speak",k:'mars'},{t:"I attract what I need through charm and connection",k:'venus'},{t:"I expand my influence through vision and generosity",k:'jupiter'},{t:"I earn authority through discipline and consistency",k:'saturn'},{t:"I understand power structures deeply — which makes me careful with them",k:'pluto'}]},
    ],
    results:{
      sun:{symbol:'☉',title:'The Sun',sub:'You are governed by radiance, identity, and the need to be fully seen.',traits:['Confidence','Authenticity','Radiance','Vitality'],body:"Your emotional world revolves around identity and recognition. You feel most alive when you are fully, unapologetically yourself — and most diminished when unseen.\n\nSun transits and solar returns are your most emotionally significant periods."},
      moon:{symbol:'☽',title:'The Moon',sub:'You are governed by instinct, memory, and the tidal pull of belonging.',traits:['Deep empathy','Emotional memory','Nurturing','Intuition'],body:"Your emotional experience is cyclical, deep, and connected to memory and home. You feel things before you think them.\n\nMonthly lunar cycles affect you more than most. Full and new moons are emotionally significant events."},
      mars:{symbol:'♂',title:'Mars',sub:'You are governed by desire, drive, and the need to act on what you feel.',traits:['Directness','Courage','Passion','Drive'],body:"Your emotions arrive as energy — urgency, desire, the compulsion to do something. You are most emotionally honest when you are in motion.\n\nMars retrogrades and Mars-sun conjunctions are particularly significant for you."},
      venus:{symbol:'♀',title:'Venus',sub:'You are governed by beauty, connection, and the need to be in harmony.',traits:['Warmth','Aesthetic sensitivity','Reciprocity','Grace'],body:"Your emotional world is profoundly shaped by beauty, connection, and the quality of your relationships. You have an unusual capacity for appreciation — finding what is beautiful even in difficult circumstances.\n\nVenus retrograde periods (every 18 months) are emotionally significant."},
      jupiter:{symbol:'♃',title:'Jupiter',sub:'You are governed by expansion, meaning, and the need to believe in something larger.',traits:['Optimism','Generosity','Vision','Expansiveness'],body:"Your emotions expand outward — they want to grow, mean something, connect to a larger story. You carry an unusual emotional generosity.\n\nJupiter's annual sign changes and conjunctions with your natal planets mark significant emotional chapters."},
      saturn:{symbol:'♄',title:'Saturn',sub:'You are governed by structure, endurance, and the long arc of earned meaning.',traits:['Resilience','Patience','Discipline','Depth'],body:"Your emotions are slow, structural, and enduring. You don't feel quickly, but what you feel persists. You need to feel that you have earned what you have.\n\nSaturn returns (ages 29 and 58) are your most significant emotional turning points."},
      pluto:{symbol:'♇',title:'Pluto',sub:'You are governed by transformation, power, and the deepest undercurrents of the psyche.',traits:['Depth','Transformation','Perception','Power'],body:"Your emotional world operates at the level of the unconscious — you feel undercurrents others can't access, and your emotions carry transformative intensity. Pluto as your ruler is rare and significant.\n\nPluto conjunctions and the ongoing Pluto-in-Aquarius era are reshaping your emotional foundations."},
    }
  }
}

// ── QUIZ ENGINE ───────────────────────────────────────────
let Q    = null   // current quiz config
let cur  = 0      // current question index
let keys = {}     // key → count (for archetype quizzes)
let pts  = 0      // points total (for score quiz)

function initQuiz() {
  const param = new URLSearchParams(window.location.search).get('q')
  if (!Q) Q = QUIZZES[param]  // use hardcoded if not loaded from DB
  const root = document.getElementById('quizRoot')
  if (!root) return
  if (!Q) { root.innerHTML = '<p style="text-align:center;color:var(--textd);padding:60px 0">Quiz not found. <a href="/quiz" style="color:var(--lav)">Back to quizzes →</a></p>'; return }
  document.title = Q.title + ' | Scorpio Zodiac'
  showIntro()
}

function showIntro() {
  const root = document.getElementById('quizRoot')
  root.innerHTML = `
    <div style="text-align:center;padding:40px 0;animation:fadeUp .4s ease">
      <div style="font-size:3.5rem;margin-bottom:14px">${Q.icon}</div>
      <p style="font-family:'DM Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.15em;color:var(--lavd);margin-bottom:10px">Scorpio Quiz</p>
      <h1 style="font-family:'Playfair Display',serif;font-size:clamp(1.6rem,4.5vw,2.5rem);color:var(--ivory);line-height:1.2;margin-bottom:12px">${Q.title}</h1>
      <p style="color:var(--texts);font-style:italic;max-width:460px;margin:0 auto 24px;line-height:1.75;font-size:.95rem">${Q.sub}</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px">
        ${Q.previews.map(p=>`<span style="padding:6px 14px;background:var(--surf);border:1px solid var(--bdr);border-radius:40px;font-family:'DM Mono',monospace;font-size:.58rem;color:var(--texts)">${p}</span>`).join('')}
      </div>
      <button class="btn btn-f" style="padding:12px 36px;font-size:.7rem" onclick="startQuiz()">Begin the Journey</button>
      <p style="font-family:'DM Mono',monospace;font-size:.55rem;color:var(--textd);margin-top:10px">✦ ${Q.questions.length} questions · Free</p>
    </div>`
}

function startQuiz() {
  cur = 0; keys = {}; pts = 0
  renderQ()
}

function renderQ() {
  const q    = Q.questions[cur]
  const tot  = Q.questions.length
  const pct  = Math.round(((cur+1)/tot)*100)
  const lbls = ['A','B','C','D','E','F','G']
  const root = document.getElementById('quizRoot')

  root.innerHTML = `
    <div style="animation:fadeUp .3s ease">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
        <div style="flex:1;height:4px;background:var(--bg2);border-radius:10px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#5c4a82,#9b7090);border-radius:10px;transition:width .4s ease"></div>
        </div>
        <span style="font-family:'DM Mono',monospace;font-size:.58rem;color:var(--textd);white-space:nowrap">${cur+1} / ${tot}</span>
      </div>
      <p style="font-family:'DM Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.1em;color:var(--lavd);margin-bottom:10px">Question ${cur+1}</p>
      <h2 style="font-family:'Playfair Display',serif;font-size:clamp(1.1rem,3vw,1.5rem);color:var(--ivory);line-height:1.35;margin-bottom:20px">${q.q}</h2>
      <div style="display:flex;flex-direction:column;gap:9px">
        ${q.opts.map((o,i)=>`
          <button onclick="pick(${i})"
            style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:var(--surf);border:1px solid var(--bdr);border-radius:14px;cursor:pointer;text-align:left;width:100%;font-family:inherit;transition:all .2s"
            onmouseover="this.style.borderColor='var(--lavd)';this.style.background='var(--surf2)'"
            onmouseout="this.style.borderColor='var(--bdr)';this.style.background='var(--surf)'">
            <span style="font-family:'DM Mono',monospace;font-size:.6rem;color:var(--lavd);background:var(--bg2);border:1px solid var(--bdr);border-radius:6px;min-width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">${lbls[i]}</span>
            <span style="font-size:.92rem;color:var(--texts);line-height:1.5">${o.t}</span>
          </button>`).join('')}
      </div>
    </div>`
}

function pick(i) {
  const o = Q.questions[cur].opts[i]
  if (Q.type === 'score') pts += o.p || 0
  else keys[o.k] = (keys[o.k]||0) + 1

  // Highlight selected
  const btns = document.querySelectorAll('#quizRoot button')
  if (btns[i]) { btns[i].style.borderColor='var(--lav)'; btns[i].style.background='linear-gradient(135deg,#2d2742,#2a2035)' }

  setTimeout(() => {
    cur++
    if (cur < Q.questions.length) renderQ()
    else showResult()
  }, 380)
}

function showResult() {
  // Compute result first (so it's ready after login)
  let result
  if (Q.type === 'score') {
    const pct = Math.round((pts / (Q.questions.length*10)) * 100)
    const tier = Q.tiers.find(t => pct >= t.min && pct <= t.max) || Q.tiers[1]
    result = { ...tier, score: pct, isScore: true }
  } else {
    const top = Object.entries(keys).sort((a,b)=>b[1]-a[1])[0][0]
    result = { ...Q.results[top] }
  }

  // Store result so we can show it after login
  window._quizResult = result

  // ── GATE — must be logged in to see results ─────────────
  const isLoggedIn = !!(window.SZ || (typeof SZ !== 'undefined' && SZ))
  if (!isLoggedIn) {
    const root = document.getElementById('quizRoot')
    root.innerHTML = `
      <div style="text-align:center;padding:40px 20px;animation:fadeUp .4s ease">
        <div style="font-size:3rem;margin-bottom:16px">🔮</div>
        <h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;color:var(--ivory);margin-bottom:10px">Your Result Is Ready</h2>
        <p style="color:var(--texts);font-style:italic;max-width:360px;margin:0 auto 24px;line-height:1.75">
          You've completed the quiz. Sign in or create a free account to reveal your result.
        </p>
        <div style="background:linear-gradient(135deg,#1e1a30,#1a1528);border:1px solid #3a3258;border-radius:var(--rl);padding:28px;max-width:400px;margin:0 auto">
          <div style="font-size:1.4rem;color:var(--lav);margin-bottom:10px">♏</div>
          <h3 style="font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--ivory);margin-bottom:8px">Unlock Your Result</h3>
          <p style="color:var(--texts);font-size:.88rem;font-style:italic;margin-bottom:18px;line-height:1.65">
            Free forever. No credit card. Just your cosmic truth.
          </p>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
            <button onclick="openModal('signup')" class="btn btn-f" style="padding:11px 24px">Join Free — See My Result</button>
            <button onclick="openModal('login')"  class="btn btn-o" style="padding:11px 24px">Sign In</button>
          </div>
        </div>
        <button onclick="startQuiz()" style="margin-top:18px;background:none;border:none;cursor:pointer;font-family:'DM Mono',monospace;font-size:.58rem;color:var(--textd);text-decoration:underline">Retake Quiz</button>
      </div>`

    // Poll for login — show result automatically after sign in
    const _quizAuthCheck = setInterval(() => {
      const user = window.SZ || (typeof SZ !== 'undefined' ? SZ : null)
      if (user) {
        clearInterval(_quizAuthCheck)
        closeModal()
        if (window._quizResult) renderResult(window._quizResult)
      }
    }, 500)

    return
  }

  renderResult(result)
}

function renderResult(result) {
  const root = document.getElementById('quizRoot')
  root.innerHTML = `
    <div style="animation:fadeUp .4s ease">
      ${result.isScore ? `
        <div style="display:flex;justify-content:center;margin-bottom:20px">
          <div style="width:140px;height:140px;position:relative;display:flex;align-items:center;justify-content:center">
            <svg viewBox="0 0 140 140" width="140" height="140" style="position:absolute;inset:0;transform:rotate(-90deg)">
              <circle cx="70" cy="70" r="58" fill="none" stroke="#2e2a42" stroke-width="7"/>
              <circle cx="70" cy="70" r="58" fill="none" stroke="${result.color||'#9b7090'}" stroke-width="7"
                stroke-linecap="round" stroke-dasharray="364"
                stroke-dashoffset="${364-(364*result.score/100)}"
                style="transition:stroke-dashoffset 1.2s ease"/>
            </svg>
            <div style="text-align:center;position:relative;z-index:1">
              <div style="font-family:'Playfair Display',serif;font-size:2.4rem;color:var(--ivory)">${result.score}</div>
              <div style="font-family:'DM Mono',monospace;font-size:.55rem;color:var(--textd)">/ 100</div>
            </div>
          </div>
        </div>` : `<div style="text-align:center;font-size:3rem;margin-bottom:16px">${result.symbol||result.icon||''}</div>`}

      <div style="text-align:center;margin-bottom:18px">
        <p style="font-family:'DM Mono',monospace;font-size:.58rem;text-transform:uppercase;letter-spacing:.14em;color:var(--lavd);margin-bottom:7px">${result.tag||'Your Result'}</p>
        <h2 style="font-family:'Playfair Display',serif;font-size:clamp(1.4rem,4vw,2rem);color:var(--ivory);margin-bottom:7px">${result.title}</h2>
        <p style="color:var(--texts);font-style:italic;font-size:.95rem">${result.sub}</p>
      </div>

      ${result.traits ? `<div style="display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin-bottom:18px">
        ${result.traits.map(t=>`<span style="padding:4px 13px;background:var(--bg2);border:1px solid var(--bdr2);border-radius:40px;font-family:'DM Mono',monospace;font-size:.58rem;color:var(--lavd)">${t}</span>`).join('')}
      </div>` : ''}

      <div class="card" style="margin-bottom:18px">
        ${result.body.split('\n\n').map(p=>`<p style="color:var(--texts);line-height:1.85;margin-bottom:13px;font-size:.96rem">${p}</p>`).join('')}
        ${result.compat ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--bdr)"><p style="font-family:'DM Mono',monospace;font-size:.55rem;text-transform:uppercase;letter-spacing:.1em;color:var(--rose);margin-bottom:5px">Best Compatibility</p><p style="color:var(--texts);font-size:.88rem;font-style:italic">${result.compat}</p></div>` : ''}
      </div>

      <div style="background:linear-gradient(135deg,#1e1a30,#1a1528);border:1px solid #3a3258;border-radius:var(--rl);padding:24px;text-align:center;margin-bottom:14px">
        <div style="font-size:1.4rem;color:var(--lav);margin-bottom:9px">♏</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:1rem;color:var(--ivory);margin-bottom:7px">Your result shapes your horoscope</h3>
        <p style="color:var(--texts);font-size:.85rem;font-style:italic;margin-bottom:14px;line-height:1.6">Read your daily horoscope tailored to your <strong style="color:var(--lav);font-style:normal">${result.title}</strong> energy.</p>
        <a href="/" class="btn btn-f" style="padding:11px 28px;text-decoration:none;display:inline-block">Read My Daily Horoscope ✦</a>
      </div>

      <div style="display:flex;gap:9px;justify-content:center;flex-wrap:wrap">
        <button onclick="startQuiz()" class="btn btn-o">Retake Quiz</button>
        <a href="/quiz" class="btn btn-o" style="text-decoration:none">Try Another Quiz</a>
      </div>
    </div>`
}

// init
document.addEventListener('authReady', async () => {
  const param = new URLSearchParams(window.location.search).get('q')
  if (!param) return

  // Try to load from database first
  try {
    const res  = await fetch(`/api/quizzes/${param}`, { credentials: 'include' })
    const data = await res.json()
    if (data.ok && data.quiz) {
      Q = data.quiz
      Q.questions = Q.questions || []
      Q.results   = Q.results   || {}
      Q.tiers     = Q.tiers     || []
      initQuiz()
      return
    }
  } catch (e) {}

  // Fallback to hardcoded quizzes
  initQuiz()
}, { once: true })
