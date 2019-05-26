const Manager = require('../infra/manager')
const ItineraryController = require('./../app/itinerary/ItineraryController')
const PassengerController = require('./../app/passenger/PassengerController')


const getItineraryRouter = require('./router/itinerary')
const getPassengerRouter = require('./router/passenger')

const subscriber = require('./subscriber')

const app = function({ server, nats, orient }) {
  const manager = new Manager({ server: orient, db: 'graph-engine' })
  const itineraryController = new ItineraryController({ manager })
  const passengerController = new PassengerController({ manager })
  
  server.route('/setup')
    .get(async (req,res) => {
      res.json({ classes: await manager.createEnvironment() })
    })
  
  server.use('/itineraries', getItineraryRouter({ itineraryController }))
  server.use('/passengers', getPassengerRouter({ nats, passengerController }))

  subscriber({ nats, passengerController })
}

module.exports = app