const express = require('express')

const router = express.Router()

// /auth/register
router.get('/register', (req, res) => {
    res.send('123')
})

module.exports = router