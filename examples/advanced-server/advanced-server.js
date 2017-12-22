var express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    userRouter = require('./user/router'),
    sensorRouter = require('./sensor/router')
var app = express()

// Third party middleware setup
app.use('/static', express.static(__dirname + '/public'))
app.use('/static', express.static(__dirname + '/files'))
app.use(compression())
app.use(bodyParser.json())

// Custom middleware setup
app.use((req, res, next) => {
    req.path !== '/favicon.ico' && console.log('-', req.method, req.path)
    next()
})

// Model router modules
app.use('/user', userRouter)
app.use('/sensor', sensorRouter)

// Start the server
app.listen(process.env.PORT || 3000, () => console.log('up & running...'))