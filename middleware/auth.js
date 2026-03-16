const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  const token = req.cookies.sz_token
  if (!token) return res.status(401).json({ error: 'Not logged in.' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Session expired. Please log in again.' })
  }
}

module.exports = { requireAuth }
