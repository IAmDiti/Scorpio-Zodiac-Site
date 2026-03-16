const express = require('express')
const { getDB } = require('../db')
const router  = express.Router()

// GET /api/quizzes — all published quizzes
router.get('/', async (req, res) => {
  try {
    const { data } = await getDB()
      .from('quizzes').select('quiz_id,icon,title,sub,previews,type,sort_order')
      .eq('status','published').order('sort_order').order('created_at')
    res.json({ ok: true, quizzes: data || [] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/quizzes/:quiz_id — single quiz with full data
router.get('/:quiz_id', async (req, res) => {
  try {
    const { data } = await getDB()
      .from('quizzes').select('*').eq('quiz_id', req.params.quiz_id).eq('status','published').maybeSingle()
    if (!data) return res.status(404).json({ error: 'Quiz not found.' })
    res.json({ ok: true, quiz: data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
