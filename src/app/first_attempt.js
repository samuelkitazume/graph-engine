const Manager = require('../infra/manager')
const itineraryExample = require('./itinerary_example')
const buildPassenger = require('./passenger_example')

const manager = new Manager()

async function test() {

  // await manager.createEnvironment()

  let newItinerary = await manager.addItinerary(itineraryExample)
  
  let stations = await Promise.all(itineraryExample.stations.map(async (s) => {
    return manager.createStation(Object.assign({}, s, { itinerary: newItinerary.hash }))
  }))
  
  let stationsObject = stations.reduce((o, s) => {
    o[s.name] = s
    return o
  }, {})
  
  let railwaysObject = itineraryExample.stations.reduce((o, s) => {
    if (s.railways && s.railways.length > 0) {
      for (let railway = s.railways.length - 1; railway > -1; railway--) {
        o[s.railways[railway]] = s.name
      }
    }
    return o
  }, {})
  
  let railways = await Promise.all(itineraryExample.railways.map((r) => {
    return manager.linkStations({
      from: stationsObject[railwaysObject[r.name]]['@rid'].toString(),
      to: stationsObject[r.destination]['@rid'].toString(),
      ticket: r.trigger,
      receipt: r.bullet
    })
  }))
  
  
  const itineraries = await manager.getItineraries()
  let passenger = buildPassenger(newItinerary.hash)
  let newPassenger = await manager.createPassenger(passenger)
  
  console.log('new itinerary', newItinerary)
  console.log('itineraries', itineraries)
  console.log('passenger', newPassenger)

}

// test()

async function movePass({ hash, ticket }) {
  let newStation = await manager.movePassenger({ hash, ticket })
  console.log(newStation)
}

movePass({ hash: 'b294fb58', ticket: 'trigger9' })

async function checkTicket({ hash, ticket }) {
  let newStation = await manager.checkTicket({ hash, ticket })
  console.log(newStation)
}

// checkTicket({ hash: '65889510', ticket: 'trigger9' })

async function getTickets({ hash }) {
  let newStation = await manager.getTickets({ hash })
  console.log('tickets',newStation)
}

// getTickets({ hash: '65889510' })