const OrientDB = require('orientjs')
const shorthash = require('short-hash')

const selectFromWhere = (select='', className, where) => 
  async (db) => await db.select(select).from(className).where(where)

class Manager {
  constructor() {
    const server = OrientDB({
      host: 'localhost',
      port: 2424,
      username: 'root',
      password: 'foo'
    })

    this.db = server.use('graph-engine')
    this.db.on("endQuery", obj => console.log('DEBUG', obj.input.query))
    
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
  async getItineraries() {
    try {
      const itineraryClass = await this.db.class.get('Itinerary')
      return itineraryClass.list()
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
        .let('itinerary', selectFromWhere('', 'Itinerary', { hash: itinerary }))
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
      const created_at = new Date()
      const hash = shorthash(`${name}_${created_at}`)
      const newPassenger = await this.db.query('begin;'
      + `let $station = SELECT FROM Station WHERE OUT("BelongsTo").hash = "${itinerary}" AND initial = TRUE;`
      + `let $passenger = CREATE VERTEX Passenger SET name = "${name}", description = "${description}", hash = "${hash}";`
      + 'let $link = CREATE EDGE Stop FROM $passenger TO $station;'
      + 'commit;'
      + 'return $passenger', { class: 's' })
      return newPassenger[0]
    } catch(e) {
      throw new Error(e)
    }
  }
  async checkTicket({ hash, ticket }) {
    try {
      const checkTicket = await this.db
        .let('passengerStation', selectFromWhere('', 'Station', `in("Stop").hash="${hash}"`))
        .let('newStation', selectFromWhere('', 'Station', `in("Railway").@rid = $passengerStation AND inE("Railway").ticket="${ticket}"`))
        .commit().return('$newStation').one()
      return !!checkTicket
    } catch(e) {
      throw new Error(e)
    }
  }
  async getTickets({ hash }) {
    try {
      const railways = await this.db
        .let('tickets', selectFromWhere('outE("Railway").ticket as tickets', 'Station', `in("Stop").hash="${hash}"`) )
        .commit().return('$tickets').all()
      return railways.map(r => r.tickets)
    } catch(e) {
      throw new Error(e)
    }
  }
  async movePassenger({ hash, ticket }) {
    try {
      this.db.on("endQuery", obj => console.log('DEBUG', obj.input.query))
      const movePassenger = await this.db
      .let('receipt', selectFromWhere('outE("Railway").receipt as receipt', 'Station', `in("Stop").hash="${hash}"`))
      .let('passenger', selectFromWhere('', 'Passenger', { hash }))
      .let('passengerStation', selectFromWhere('', 'Station', `in("Stop").hash="${hash}"`))
      .let('newStation', selectFromWhere('in', 'TRAVERSE outE("Railway") FROM $passengerStation MAXDEPTH 1', `ticket="${ticket}"`))
      .let('newStop', (n) => {
        n.create('EDGE', 'Stop')
        .from('$passenger')
        .to('$newStation.in')
      })
      .let('removeStop', (r) => {
        r.delete('EDGE', 'Stop')
        .from('$passenger')
        .to('$passengerStation')
      })
      .commit().return('$receipt').one()
      return movePassenger
    } catch(e) {
      throw new Error(e)
    }
  }
}

module.exports = Manager