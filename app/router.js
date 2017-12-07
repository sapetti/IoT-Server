const express = require('express')
const { constants } = require('./config')

module.exports = (function() {
  let model = null

  function getBoards() {
    return model.readData(constants.BOARD, {}).then(res => {
      console.log('/boards', JSON.stringify(res))
      return res
    })
  }

  function _init(dbInstance) {
    model = dbInstance
    const app = express()

    // Configuration
    app.use(express.static('public'))
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      )
      next()
    })

    // Routes
    app.get('/boards', (req, res) => {
      getBoards().then(boards => {
        res.json({ boards: boards })
      })
    })

    app.get('/', (req, res) => res.send('Hello World!'))

    app.post('/', function(req, res) {
      res.send('Got a POST request')
    })

    app.listen(8080, () => console.log('Example app listening on port 8080!'))
  }

  return {
    init: _init
  }
})()
