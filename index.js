const OrientDB = require('orientjs');

const server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'foo'
});

const db = server.use('test');

db.select()
  .from('E')
  .where({in: "#14:0"})
  .all()
  .then(result => {
    console.log(result);
  });
