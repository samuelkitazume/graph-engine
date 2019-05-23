const shortHash = require('short-hash')

class passengerRepository {
  constructor ({ DB }) {
    this.DB = DB
  }
  hashRid(passenger) {
    return shortHash(passenger)
  }
  createPathId(passenger) {
    return `path_${this.hashRid(passenger)}`
  }
  async linkPassengerToStation(passenger, rid) {
    try {
      const link = await this.DB.createLink('passenger_link', passenger, rid, { type: 'location' })
      return link
    } catch(e) {
      throw new Error(e)
    }
  }
  async createPassenger(passenger, rid) {
    try {
      const new_passenger = await this.DB.createVertexRecord('Passenger', passenger)
      new_passenger.hash = this.createPathId(new_passenger['@rid'].toString())
      await this.DB.updateRecord(new_passenger)
      await this.linkPassengerToStation(new_passenger['@rid'].toString(), rid)
      return new_passenger
    } catch(e) {
      throw new Error(e)
    }
  }
  async getPassenger(hash) {
    try {
      const passenger = await this.DB.getOneRecordFilter('Passenger', { hash })
      return passenger
    } catch(e) {
      throw new Error(e)
    }
  }
}

module.exports = passengerRepository