const {Router} = require('express')
const path = require('path')
const router = Router()

router.get('/', (req, res) => {
    res.send(path.join(__dirname, 'README.md'))
})

module.exports = router;