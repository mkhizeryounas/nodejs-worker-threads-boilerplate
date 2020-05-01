const keys = require('./keys');

const { Pool } = require('pg');

module.exports = (db = keys.pg.database) => {
  const pool = new Pool({
    host: keys.pg.host,
    user: keys.pg.user,
    password: keys.pg.password,
    database: db,
    port: keys.pg.port,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 999999999,
  });
  return {
    query: async function (text, values) {
      return new Promise((resolve, reject) => {
        pool.connect(function (err, client, done) {
          if (err) {
            console.log('Connection error', err);
            return reject('err');
          }
          client.query(text, values, function (err, result) {
            done();
            if (err) {
              console.log('Query error', err);
              return reject('err');
            }
            return resolve(result.rows);
          });
        });
      });
    },
  };
};
