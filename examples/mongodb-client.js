
// MONGO DB

const { MongoClient } = require('mongodb')

MongoClient.connect('mongodb://user:password@server:port/db', (err, db) => {
    if(err) throw new Error('Unable to connect to the server:: ' + err)
    console.log('Connected to mLab')
    // After connect, ry to insert some dummy documents in the database
    insertDocuments(db, resp => console.log('results:: ', JSON.stringify(response)))
    db.close()
})

const insertDocuments = (db, cb) => {
    const docs = db.collection('documents')
    docs.insertMany([
        {a: 1}, {a: 2}, {a: 3}
    ], 
    (err, result) => {
        if(err) throw new Error('Unable to insert documents:: ' + err)
        cb(result)
    })
}