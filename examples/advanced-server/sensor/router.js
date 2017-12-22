var router = require('express').Router()

var sensors = [
    { board: 'NodeMCU1', location: '/room/temperature' },
    { board: 'NodeMCU1', location: '/room/humidity' },
    { board: 'NodeMCU2', location: '/kitchen/temperature' },
]

// Middleware for this model
router.use('/:index', (req, res, next) => {
    console.log('middleware:: only called for /sensors')
    if (req.method === 'GET' && (req.params.index < 0 || req.params.index >= sensors.length)) {
        res.status('500').send('Sensor not found')
    }
    next()
})

// Controllers
router.get('/', (req, res) => res.json({ sensors: sensors }))

router.get('/:index', (req, res) => res.json(sensors[req.params.index]))

router.post('/', (req, res) => {
    sensors.push(req.body)
    res.status(201).send('Sensor added')
})

module.exports = router