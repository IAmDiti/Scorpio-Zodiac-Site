// routes/admin.js
// Protected routes — only accessible by admin email
// POST   /api/admin/posts        — create post
// PUT    /api/admin/posts/:id    — update post
// DELETE /api/admin/posts/:id    — delete post

const express  = require('express')
const { getDB }       = require('../db')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

const ADMIN_EMAIL = 'ditidon@gmail.com'

// Middleware — only allow admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Admin access only.' })
  }
  next()
}

// ── CREATE POST ──────────────────────────────────────────
router.post('/posts', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, slug, tag_label, category, read_time, status, excerpt, content } = req.body
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug and content are required.' })
    }

    // Check slug not taken
    const { data: existing } = await getDB()
      .from('posts').select('id').eq('slug', slug).maybeSingle()
    if (existing) {
      return res.status(409).json({ error: `Slug "${slug}" is already used. Choose a different one.` })
    }

    const { data, error } = await getDB()
      .from('posts')
      .insert({
        title, slug, tag_label, category: category || tag_label || 'Astrology',
        read_time: read_time || '5 min read',
        status:    status    || 'published',
        excerpt, content,
        published_at: status === 'draft' ? null : new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ ok: true, post: data })
  } catch (err) {
    console.error('create post error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── UPDATE POST ──────────────────────────────────────────
router.put('/posts/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, slug, tag_label, category, read_time, status, excerpt, content } = req.body

    const updates = {
      title, slug, tag_label, category: category || tag_label,
      read_time, status, excerpt, content,
      updated_at: new Date().toISOString(),
    }
    // Set published_at if publishing for first time
    if (status === 'published') {
      const { data: existing } = await getDB()
        .from('posts').select('published_at').eq('id', req.params.id).single()
      if (!existing?.published_at) updates.published_at = new Date().toISOString()
    }

    const { data, error } = await getDB()
      .from('posts').update(updates).eq('id', req.params.id).select().single()

    if (error) throw error
    res.json({ ok: true, post: data })
  } catch (err) {
    console.error('update post error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── DELETE POST ──────────────────────────────────────────
router.delete('/posts/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { error } = await getDB()
      .from('posts').delete().eq('id', req.params.id)
    if (error) throw error
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/admin/generate-personal ───────────────────
router.post('/generate-personal', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { generatePersonalHoroscopes } = require('../personal-cron')
    // Run async and track result
    let generated = 0, skipped = 0

    // Patch log to count
    const origLog = console.log
    await generatePersonalHoroscopes()

    // Re-read counts from DB for today
    const today = new Date().toISOString().split('T')[0]
    const { data: rows } = await getDB()
      .from('personal_horoscopes')
      .select('id', { count: 'exact' })
      .eq('date', today)

    res.json({ ok: true, generated: rows?.length || 0, skipped: 0 })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
router.get('/quizzes', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await getDB()
      .from('quizzes').select('*').order('sort_order').order('created_at')
    if (error) throw error
    res.json({ ok: true, quizzes: data || [] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/admin/quizzes ──────────────────────────────
router.post('/quizzes', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { quiz_id, icon, title, sub, previews, type, questions, results, tiers, status, sort_order } = req.body
    if (!quiz_id || !title) return res.status(400).json({ error: 'quiz_id and title are required.' })

    const { data: existing } = await getDB().from('quizzes').select('id').eq('quiz_id', quiz_id).maybeSingle()
    if (existing) return res.status(409).json({ error: `Quiz ID "${quiz_id}" already exists.` })

    const { data, error } = await getDB().from('quizzes').insert({
      quiz_id, icon, title, sub,
      previews:   Array.isArray(previews)   ? previews   : [],
      type:       type || 'key',
      questions:  Array.isArray(questions)  ? questions  : [],
      results:    results || {},
      tiers:      Array.isArray(tiers)      ? tiers      : [],
      status:     status || 'published',
      sort_order: sort_order || 0,
    }).select().single()
    if (error) throw error
    res.status(201).json({ ok: true, quiz: data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/admin/quizzes/:id ───────────────────────────
router.put('/quizzes/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { icon, title, sub, previews, type, questions, results, tiers, status, sort_order } = req.body
    const { data, error } = await getDB().from('quizzes').update({
      icon, title, sub,
      previews:   Array.isArray(previews)   ? previews   : [],
      type:       type || 'key',
      questions:  Array.isArray(questions)  ? questions  : [],
      results:    results || {},
      tiers:      Array.isArray(tiers)      ? tiers      : [],
      status:     status || 'published',
      sort_order: sort_order || 0,
      updated_at: new Date().toISOString(),
    }).eq('id', req.params.id).select().single()
    if (error) throw error
    res.json({ ok: true, quiz: data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── DELETE /api/admin/quizzes/:id ────────────────────────
router.delete('/quizzes/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { error } = await getDB().from('quizzes').delete().eq('id', req.params.id)
    if (error) throw error
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
