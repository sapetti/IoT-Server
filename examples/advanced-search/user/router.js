var router = require('express').Router()

var users = [
    { name: 'John', age: 36 },
    { name: 'Paul', age: 40 },
    { name: 'Greg', age: 27 },
]

router.get('/', (req, res) => res.json({ users: users }))

router.get('/:index', (req, res) => res.json(users[req.params.index]))

router.post('/', (req, res) => {
    users.push(req.body)
    res.status(201).send('User added')
})

module.exports = router