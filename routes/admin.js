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

module.exports = router
