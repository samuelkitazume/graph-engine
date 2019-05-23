const shortHash = require('short-hash')

class ItineraryRepository {
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
  createItineraryId(v) {
    const hash = shortHash(v['@rid'].toString())
    return `itinerary_${hash}`
  }
  async createItineraryClass(itineraryId) {
    try {
      const c = await this.DB.createVertex(itineraryId)
      return c
    } catch(e) {
      throw new Error(e)
    }
  }
  async createMapRecord() {
    let new_map_vertex = await this.DB.createVertexRecord('Map', { created_at: new Date() })
    const itineraryId = this.createItineraryId(new_map_vertex)
    new_map_vertex.itineraryId = itineraryId
    new_map_vertex = await this.DB.updateRecord(new_map_vertex)
    await this.createItineraryClass(itineraryId)
    
    return new_map_vertex
  }
  async createLink(itineraryId, from, to, data) {
    try {
      const link = await this.DB.createLink(`edge_${itineraryId}`, from, to, data)
      return link
    } catch(e) {
      throw new Error(e)
    }
  }
  async createItinerary({ name, description, stations, railways }) {
    const map_record = await this.createMapRecord()
    const itineraryId = map_record.itineraryId

    const stations_list = await Promise.all(stations.map(async (s) => {
      const data = s.initial
        ? Object.assign({}, s, { itinerary_data: { name, description, itineraryId }})
        : s
      return await this.DB.createVertexRecord(itineraryId, data)
    }))

    stations_list.forEach(s => {
      if (s.railways) {
        s.railways.forEach(async (r) => {
          const railway = railways.find(rail => rail.name === r)
          const destiny = stations_list.find(st => st.name === railway.destination)
          const from = s['@rid'].toString()
          const to = destiny['@rid'].toString()
          this.createLink(itineraryId, from, to, railway)
        })
      }
    })
    
    return itineraryId
  }
}

module.exports = ItineraryRepository