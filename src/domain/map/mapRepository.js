class MapRepository {
  constructor ({ DB }) {
    this.DB = DB
  }
  async getMap() {
    return await this.DB.getVertex('Map')
  }
}

module.exports = MapRepository