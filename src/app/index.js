const example = require('./itinerary_example')
const passenger_example = require('./passenger_example')
const Database = require('./../infra/DB')
const ItineraryRepository = require('./../infra/repositories/itinerary')
const Itinerary = require('./../domain/itinerary')

const DB = new Database()

const itineraryRepository = new ItineraryRepository({ DB })

async function createPassenger(passenger, itinerary) {
  const new_passenger = await DB.createVertexRecord('passenger', passenger)
  const new_path_class = await DB.createVertex(`passenger_${new_passenger['@rid'].toString().split('#').join('').split(':').join('_')}`)
  const new_path = await DB.createVertexRecord(new_path_class.name, { last: true })
  const linkPassengerToStation = await DB.createLink(
    'e1',
    new_passenger['@rid'].toString(),
    itinerary.getInitial()['@rid'].toString(),
    { type: 'location' }
  )
} 

async function test() {
  const newVertex = await DB.createVertex('v1')
  // const passengerVertex = await DB.createVertex('passenger')
  
  const stations = await Promise.all(example.stations.map(async (s) => {
    const data = s.initial ? Object.assign({}, s, { itinerary_data: { name: example.name, description: example.description } }) : s
    return await DB.createVertexRecord('v1', data)
  }))
  
  let edges = []
  
  stations.forEach(s => {
    if (s.railways) {
      s.railways.forEach(async (r) => {
        const railway = example.railways.find(rail => rail.name === r)
        const destiny = stations.find(st => st.name === railway.destination)
        const from = s['@rid'].toString()
        const to = destiny['@rid'].toString()
        const new_railway = await DB.createLink('e1', from, to, railway)
        edges.push(new_railway);
      })
    }
  })

  const itineraryFromDB = await itineraryRepository.getItinerary('v1')
  const itinerary = new Itinerary({ stations: itineraryFromDB })
  console.log(itinerary)  

  createPassenger(passenger_example, itinerary)
}

test()