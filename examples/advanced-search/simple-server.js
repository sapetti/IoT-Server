// npm i nodemon -G/--global

var express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression')
var app = express()

var sensors = [
    { board: 'NodeMCU1', location: '/room/temperature' },
    { board: 'NodeMCU1', location: '/room/humidity' },
    { board: 'NodeMCU2', location: '/kitchen/temperature' },
]

var users = [
    { name: 'John', age: 36 },
    { name: 'Paul', age: 40 },
    { name: 'Greg', age: 27 },
]

// Third party middleware setup
// app.use(express.static('public'))
// app.use(express.static('files'))
// app.use(express.static(__dirname + '/public'))
// app.use(express.static(__dirname + '/files'))
app.use('/static', express.static(__dirname + '/public'))
app.use('/static', express.static(__dirname + '/files'))

app.use(compression())

app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// Custom middleware setup
app.use((req, res, next) => {
    console.log('middleware:: always called')
    req.path !== '/favicon.ico' && console.log('-', req.method, req.path)
    next()
})

app.use('/sensor/:index', (req, res, next) => {
    console.log('middleware:: only called for /sensors')
    if (req.method === 'GET' && (req.params.index < 0 || req.params.index >= users.length)) {
        console.log('User not found')
        res.status('500').send('User not found')
    }
    console.log('next()')
    next()
})


// Users
app.get('/user', (req, res) => res.json({ users: users }))

app.get('/user/:index', (req, res) => res.json(users[req.params.index]))

app.post('/user', (req, res) => {
    //see body parser
    console.log('body:', req.body)
    users.push(req.body)
    res.status(201).send('User added')
})

// Sensors
app.get('/sensor', (req, res) => res.json({ sensors: sensors }))

app.get('/sensor/:index', (req, res) => res.json(sensors[req.params.index]))

app.post('/sensor', (req, res) => {
    //see body parser
    console.log('body:', req.body)
    sensors.push(req.body)
    res.status(201).send('Sensor added')
})


app.listen(process.env.PORT || 3000, () => console.log('up & running...'))