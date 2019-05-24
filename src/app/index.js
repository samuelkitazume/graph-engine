const Manager = require('../infra/manager')
const ItineraryController = require('./../app/itinerary/ItineraryController')
const PassengerController = require('./../app/passenger/PassengerController')

const manager = new Manager()
const itineraryController = new ItineraryController({ manager })
const passengerController = new PassengerController({ manager })

const app = function(server) {
  
  server.route('/itineraries')
    .get(async (req, res) => {
      const itineraries = await itineraryController.getItineraries()
      res.json({ itineraries })
    })
    .post(async (req, res) => {
      const { name='', description='', stations, railways } = req.body.itinerary

      if (typeof stations === 'undefined' || stations === null) {
        res.status(400).send('Bad request')
      }

      if (typeof railways === 'undefined' || railways === null) {
        res.status(400).send('Bad request')
      }

      const newItinerary = await itineraryController.createItinerary({ name, description, stations, railway })
      res.json({ itinerary: newItinerary })
    })
  
  server.route('/passengers/:hash')
    .get(async (req, res) => {
      const passenger = await passengerController.getPassenger({ hash: req.params.hash })
      res.json({ passenger })
    })

  server.route('/passengers')
    .get(async (req, res) => {
      const passengers = await passengerController.getPassengers()
      res.json({ passengers })
    })
    .post(async (req, res) => {
      const { name='', description='', itinerary } = req.body.passenger
      
      if (typeof itinerary === 'undefined' || itinerary === null) {
        res.status(400).send('Bad request')
      }

      const newPassenger = await passengerController.createPassenger({ name, description, itinerary })
      res.json({ passenger: newPassenger })
    })

}

module.exports = app