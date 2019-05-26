class ItineraryController {
  
  constructor({ manager }) {
    this.manager = manager
  }
  
  async createItinerary(o) {
  
    let newItinerary = await this.manager.addItinerary(o)
    
    let stations = await Promise.all(o.stations.map(async (s) => {
      return this.manager.createStation(Object.assign({}, s, { itinerary: newItinerary.hash }))
    }))
    
    let stationsObject = stations.reduce((o, s) => {
      o[s.name] = s
      return o
    }, {})
    
    let railwaysObject = o.stations.reduce((o, s) => {
      if (s.railways && s.railways.length > 0) {
        for (let railway = s.railways.length - 1; railway > -1; railway--) {
          o[s.railways[railway]] = s.name
        }
      }
      return o
    }, {})
    
    await Promise.all(o.railways.map((r) => {
      return this.manager.linkStations({
        from: stationsObject[railwaysObject[r.name]]['@rid'].toString(),
        to: stationsObject[r.destination]['@rid'].toString(),
        ticket: r.trigger,
        receipt: r.bullet
      })
    }))
    
    return newItinerary
  }

  async getItineraries() {
    return await this.manager.getItineraries()
  }
  
}

module.exports = ItineraryController