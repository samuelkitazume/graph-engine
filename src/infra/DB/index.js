const OrientDB = require('orientjs');

class DB {
  construct(config) {
    const server = OrientDB({
      host: 'localhost',
      port: 2424,
      username: 'root',
      password: 'foo'
    })

    this.db = server.use('graph-engine')
  }
  async createVertex(name) {
    try {
      const v =this.db.class.create(name, 'V')
      return v
    } catch(e) {
      throw new Error(e)
    }
  }
  async createEdge(name) {
    try {
      const e = this.db.class.create(name, 'E')
      return e
    } catch(e) {
      throw new Error(e)
    }
  }
  async getVertex(name) {
    try {
      const v = this.db.class.get(name)
      return v
    } catch(e) {
      throw new Error(e)
    }
  }
  async getEdge(name) {
    return this.getVertex(name)
  }
  async createRecord(oClass, properties) {
    try {
      const new_record = await oClass.create(properties);
      return new_record;
    } catch(e) {
      throw new Error(e)
    }
  }
}

export default DB