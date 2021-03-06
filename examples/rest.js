const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/', function (req, res) {
    res.send('Got a POST request')
  })

app.use(express.static('public'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))