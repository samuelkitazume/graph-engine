const express = require('express')
const app = express.Router()

const router = function({ itineraryController }) {
  app.route('/')
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

      const newItinerary = await itineraryController.createItinerary({ name, description, stations, railways })
      res.json({ itinerary: newItinerary })
    })
  
  return app
}

module.exports = router