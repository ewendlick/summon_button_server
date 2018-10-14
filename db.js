const sqlite3 = require('sqlite3').verbose()
const moment = require('moment')

class DB {
  constructor() {
    const DB_PATH = './leo.db' // TODO: pass in

    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        return console.error(err) // was message(s)
      }
      console.log('Connected to ' + DB_PATH)
    })
  }

  getAll () {
    const sql = `
      SELECT * FROM leo;`
    return this.db.all(sql)
  }

  createIfNotExists () {
    const sql = `
      CREATE TABLE IF NOT EXISTS leo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      created_at DATETIME);`
    return this.db.run(sql)
  }

  insert (contentObject) {
    const sql = `
      INSERT INTO leo (ip, created_at)
      VALUES ("${contentObject.ip}", "${moment().format('YYYY-MM-DD hh:mm:ss')}");`
    return this.db.run(sql)
  }

  close () {
    this.db.close((err) => {
      if (err) {
        return console.error(err.message)
      }
      console.log('Closing database connection')
    })
  }
}

module.exports = DB