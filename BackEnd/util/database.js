const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dotenv = require('dotenv');

dotenv.config();

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(process.env.MONGODB_URI)
        .then(client => {
            console.log("connected");
            _db = client.db()
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
}

const getDB = () => { //connection pooling
    if (_db) {
        return _db;
    }

    throw 'no database found'
}
module.exports = {
    mongoConnect,
    getDB
}
