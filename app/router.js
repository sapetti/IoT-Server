const express = require('express')
const { constants } = require('./config')

module.exports = (function() {
  let model = null

  function getBoards(query = {}) {
    return model.readData(constants.BOARD, query)
  }

  function getBoard(id) {
    return getBoards({ id }).then(b => {
      //TODO: Remove this as services info should be also in DB
      b.services = [{ name: 'temperature', type: constants.TS }]
      return b
    })
  }

  function unregisterBoard(id) {
    return (
      getBoard(id)
        .then(b =>
          //Remove all timeseries data for the board
          Promise.all(
            b.services
              .filter(({ type }) => type === constants.TS)
              .map(({ name: service }) =>
                model.dropCollection(`${id}-${service}`)
              )
          )
        )
        .then(res => {
          console.log('/unregister', JSON.stringify(res))
          return res
        })
        //Remove the board data
        .then(() => model.removeData(constants.BOARD, { id }))
        .then(res => {
          console.log('/unregister', JSON.stringify(res))
          return res
        })
    )
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
    app.get(
      '/boards',
      (req, res) => getBoards().then(boards => res.json({ boards }))
      //.catch(ErrorType, res.status(500).jsonp({error: 'Something broke!'});)
    )

    app.delete('/unregister/:id', (req, res) => {
      unregisterBoard(Number(req.params.id)).then(() => res.status(200))
      //.catch(ErrorType, res.status(500).jsonp({error: 'Something broke!'});)
    })

    app.get('/', (req, res) => res.send('Hello World!'))

    app.post('/', function(req, res) {
      res.send('Got a POST request')
    })

    const port = process.env.PORT || 8080
    app.listen(port, () => console.log('Example app listening on port', port))
  }

  return {
    init: _init
  }
})()
