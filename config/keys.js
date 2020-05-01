if (process.env.NODE_ENV === 'production') require('dotenv').config();
module.exports = {
  pg: {
    host: process.env.db_host || 'localhost',
    port: process.env.db_port || 5432,
    user: process.env.db_user || 'postgres',
    password: process.env.db_password || 'root',
    database: process.env.db_database || 'lms-core',
  },
  secret: process.env.secret || 'c6aSsUzQBACrdWoWy6g7BkuxwKfkPbmB',
  db_names: {
    core: 'lms-core',
    member: 'lms-member',
  },
};
