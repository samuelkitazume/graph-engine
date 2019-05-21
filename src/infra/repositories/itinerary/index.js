class Itinerary {
  constructor ({ DB }) {
    this.DB = DB
  }
  async getItinerary(vertexName) {
    try {
      const itinerary =  await (async (c) => { return await c.list() })(await this.DB.getVertex(vertexName))
      return itinerary
    } catch(e) {
      throw new Error(e)
    }
  }
}

module.exports = Itinerary