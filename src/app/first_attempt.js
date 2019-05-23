const example = require('./itinerary_example')
const passenger_example = require('./passenger_example')
const Database = require('../infra/DB')
const Itinerary = require('../domain/itinerary')
const ItineraryRepository = require('../domain/itinerary/itineraryRepository')
const Passenger = require('../domain/passenger')
const PassengerRepository = require('../domain/passenger/passengerRepository')
const StationRepository = require('../domain/station/stationRepository')
const RailwayRepository = require('../domain/railway/railwayRepository')

const DB = new Database()

const itineraryRepository = new ItineraryRepository({ DB })
const passengerRepository = new PassengerRepository({ DB })
const stationRepository = new StationRepository({ DB })
const railwayRepository = new RailwayRepository({ DB })

async function test() {
  const itineraryCreated = await itineraryRepository.createItinerary(example)
  const itineraryGot = await itineraryRepository.getItinerary(itineraryCreated)
  const itinerary = new Itinerary({ stations: itineraryGot })

  const passengerCreated = await passengerRepository.createPassenger(passenger_example(itineraryCreated), itinerary.getInitial()['@rid'].toString())
  const passengerGot = await passengerRepository.getPassenger(passengerCreated.hash)
  const passenger = new Passenger(passengerGot)
  const passengerRailwayToStation = await railwayRepository.getRailway(passenger.linkToStation.toString())
  const passengerStation = await stationRepository.getStation(passengerRailwayToStation.in.toString())

  console.log(itinerary, passengerGot, passengerRailwayToStation, passengerStation)
}

test()