const Mongodb = require('mongodb');
const MongoClient = Mongodb.MongoClient;

let database;

async function connect() {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017/');
    database = client.db('authors');
};

function dbconnectionerror() {
    if (!database) {
        alert('database is not established!');
    }
    return database;
}

module.exports = {
    connecttodb: connect,
    checkconnection: dbconnectionerror
};
