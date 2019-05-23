class railwayRepository {
  constructor ({ DB }) {
    this.DB = DB
  }
  async getRailway(rid) {
    try {
      const railway = await this.DB.getRecord(rid)
      return railway
    } catch(e) {
      throw new Error(e)
    }
  }
}

module.exports = railwayRepository