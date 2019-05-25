const Manager = require('../infra/manager')
const ItineraryController = require('./../app/itinerary/ItineraryController')
const PassengerController = require('./../app/passenger/PassengerController')

const manager = new Manager()
const itineraryController = new ItineraryController({ manager })
const passengerController = new PassengerController({ manager })

const getItineraryRouter = require('./router/itinerary')
const getPassengerRouter = require('./router/passenger')

const app = function(server) {

  server.route('/setup')
    .get(async (req,res) => {
      res.json({ classes: await manager.createEnvironment() })
    })
  
  server.use('/itineraries', getItineraryRouter({ itineraryController }))
  server.use('/passengers', getPassengerRouter({ passengerController }))

}

module.exports = app