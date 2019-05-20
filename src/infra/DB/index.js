const OrientDB = require('orientjs');

class DB {
  constructor() {
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
      const v = await this.db.class.create(name, 'V')
      return v
    } catch(e) {
      throw new Error(e)
    }
  }
  async createEdge(name) {
    try {
      const e = await this.db.class.create(name, 'E')
      return e
    } catch(e) {
      throw new Error(e)
    }
  }
  async getVertex(name) {
    try {
      const v = await this.db.class.get(name)
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
      const new_record = await oClass.create(properties)
      return new_record;
    } catch(e) {
      throw new Error(e)
    }
  }
  async createLink(name, from, to, properties) {
    try {
      const new_link = await DB.create('EDGE', name).from(from).to(to).set(properties).one()
      return new_link;
    } catch(e) {
      throw new Error(e)
    }
  }
  async createVertexRecord(className, properties) {
    try {
      const new_record = await this.db.create('VERTEX', className).set(properties).one()
      return new_record
    } catch(e) {
      throw new Error(e)
    }
  }
  async createEdgeRecord(edgeName, from, to, properties) {
    try {
      const new_record = await this.db.create('EDGE', edgeName).from(from).to(to).set(properties).one()
      return new_record
    } catch(e) {
      throw new Error(e)
    }
  }
}

module.exports = DB