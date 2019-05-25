const express = require('express')
const router = express.Router()

const app = function({ passengerController }) {
  
  router.route('/:hash')
    .get(async (req, res) => {
      const passenger = await passengerController.getPassenger({ hash: req.params.hash })
      res.json({ passenger })
    })
    .post(async (req, res) => {
      const receipt = await passengerController.useTicket({ passengerHash: req.params.hash, ticket: req.body.ticket })
      res.json({ receipt })
    })
  
  router.route('/')
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

  return router
}

module.exports = app