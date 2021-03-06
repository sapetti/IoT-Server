const { MongoClient } = require('mongodb')
const Promise = require('bluebird')

module.exports = (function() {
  let db = null

  function _init({ url, user, password, port, database }) {
    return new Promise((resolve, reject) => {
      if (!url || !user || !password || !port || !database)
        return reject(
          'MongoDB: Review your connection, there is at least one option missing (url, user, password, port or database)'
        )
      MongoClient.connect(
        `mongodb://${user}:${password}@${url}:${port}/${database}`,
        (err, connection) => {
          if (err)
            return reject(
              `MongoDB: Unable to connect to MongoDB server:: ${err}`
            )
          console.log('MongoDB: Connected to MongoDB database')
          db = connection
          resolve()
        }
      )
    })
  }

  function _readData(collection, query) {
    return new Promise((resolve, reject) => {
      db
        .collection(collection)
        .find(query)
        .toArray(function(err, items) {
          if (err) return reject('MongoDB: Unable to read documents:: ' + err)
          console.log('MongoDB: Documents retrieved:: ' + items.length)
          resolve(items)
        })
    })
  }

  function _writeData(collection, document) {
    return new Promise((resolve, reject) => {
      db.collection(collection).insert(document, (err, result) => {
        if (err) return reject('MongoDB: Unable to insert documents:: ' + err)
        console.log('MongoDB: Document/s inserted')
        resolve(result)
      })
    })
  }

  function _removeData(collection, query) {
    return new Promise((resolve, reject) => {
      db.collection(collection).deleteOne(query, (err, result) => {
        if (err) return reject('MongoDB: Unable to remove document:: ' + err)
        console.log('MongoDB: Document removed', JSON.stringify(query))
        resolve(result)
      })
    })
  }

  function _dropCollection(collection, id) {
    return new Promise((resolve, reject) => {
      //Check if exists and drop it
      db.collection(collection) &&
        db.collection(collection).drop((err, result) => {
          if (err) return reject('MongoDB: Unable to drop collection:: ' + err)
          console.log('MongoDB: Collection dropped')
          resolve(result)
        })
      resolve() //Collection does not exist
    })
  }

  return {
    init: _init,
    writeData: _writeData,
    readData: _readData,
    removeData: _removeData,
    dropCollection: _dropCollection
  }
})()
