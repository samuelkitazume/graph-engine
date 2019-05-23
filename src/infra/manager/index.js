const OrientDB = require('orientjs')
const shorthash = require('short-hash')

class Manager {
  constructor() {
    const server = OrientDB({
      host: 'localhost',
      port: 2424,
      username: 'root',
      password: 'foo'
    })

    this.db = server.use('graph-engine')
  }
  async createEnvironment() {
    try {
      await this.db.class.create('Passenger', 'V')
      await this.db.class.create('Station', 'V')
      await this.db.class.create('Itinerary', 'V')
      await this.db.class.create('BelongsTo', 'E')
      await this.db.class.create('Stop', 'E')
    } catch(e) {
      throw new Error(e)
    }
  }
  async addItinerary({ name, description }) {
    try {
      const created_at = new Date()
      const hash = shorthash(`${name}-${created_at}`)
      const newItinerary = await this.db
        .create('VERTEX', 'Itinerary')
        .set({ name, hash, description, created_at })
        .one()
      return newItinerary
    } catch(e) {
      throw new Error(e)
    }
  }
  async createStation({ name, description, itinerary, initial }) {
    try {
      const newStation = await this.db
        .let('itinerary', (i) => {
          i.select()
            .from('Itinerary')
            .where({ hash: itinerary })
        })
        .let('station', (s) => {
          s.create('VERTEX', 'Station')
            .set({ name, description, itinerary, initial })
        })
        .let('link', (l) => {
          l.create('EDGE', 'BelongsTo')
            .from('$station')
            .to('$itinerary')
        })
        .commit()
        .return('$station')
        .one()
      return newStation
    } catch(e) {
      throw new Error(e)
    }
  }
  async linkStations({ from, to, ticket, receipt }) {
    try {
      const newLink = await this.db
        .create('EDGE', 'Railway')
        .from(from)
        .to(to)
        .set({ ticket, receipt })
        .one()
      return newLink
    } catch(e) {
      throw new Error(e)
    }
  }
  async createPassenger({ name, description, itinerary }) {
    try {
      const newPassenger = await this.db.query('begin;'
      + `let $station = SELECT FROM Station WHERE OUT("BelongsTo").hash = "${itinerary}" AND initial = TRUE;`
      + `let $passenger = CREATE VERTEX Passenger SET name = "${name}", description = "${description}";`
      + 'let $link = CREATE EDGE Stop FROM $passenger TO $station;'
      + 'commit;'
      + 'return $passenger', { class: 's' })
      return newPassenger
    } catch(e) {
      throw new Error(e)
    }
  }
}

module.exports = Manager