class Itinerary {
  constructor ({ name, description='', stations }) {
    this.name = name
    this.description = description
    this.stations = stations
    
    if (typeof name === 'undefined' || name === null) {
      const initial = this.getInitial()
      const itinerary_data = initial.itinerary_data
      this.name = itinerary_data.name
      this.description = itinerary_data.description
    }
  }
  getInitial() {
    return this.stations.find(s=>s.initial===true)
  }
  getStationByName(name) {
    return this.stations.find(s=>s.name===name)
  }
  getStationByRid(rid) {
    return this.stations.find(s=>s['@rid'].toString() == rid)
  }
}

module.exports = Itinerary