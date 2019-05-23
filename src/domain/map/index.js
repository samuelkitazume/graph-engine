class Map {
  constructor ({ list=[] }) {
    this.list = list
  }
  getList() {
    return this.list
  }
  getItinerary(name) {
    return this.list.find(i=>i.name===name)
  }
}

module.exports = Map