const express  = require('express')
const { getDB } = require('../db')
const router   = express.Router()

router.get('/posts', async (req, res) => {
  try {
    const { data } = await getDB()
      .from('posts').select('id,slug,title,excerpt,tag_label,category,read_time,published_at')
      .eq('status','published').order('published_at',{ascending:false}).limit(parseInt(req.query.limit)||10)
    res.json({ ok: true, posts: data || [] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/posts/:slug', async (req, res) => {
  try {
    const { data } = await getDB()
      .from('posts').select('*').eq('slug', req.params.slug).eq('status','published').maybeSingle()
    if (!data) return res.status(404).json({ error: 'Post not found.' })
    res.json({ ok: true, post: data })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
