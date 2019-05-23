class stationRepository {
  constructor ({ DB }) {
    this.DB = DB
  }
  async getStation(rid) {
    try {
      const station = await this.DB.getRecord(rid)
      return station
    } catch(e) {
      throw new Error(e)
    }
  }
}

module.exports = stationRepository