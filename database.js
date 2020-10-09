const { Database } = require('quickmongo');
const db = new Database("mongodb://localhost/testingggg");

db.on('ready', () => {
    console.log('Connected to mongoose')
})

module.exports = db;