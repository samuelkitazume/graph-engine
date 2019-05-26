const subscriber = function({ nats, passengerController }) {
  nats.subscribe('passenger.tickets.list', async ({ hash }, replyTo) => {
    nats.publish(replyTo, await passengerController.getValidTicketsList({ passengerHash: hash }))
  })

  nats.subscribe('passenger.tickets.check', async ({ hash, ticket }, replyTo) => {
    nats.publish(replyTo, await passengerController.checkPassengerTicket({ passengerHash: hash, ticket }))
  })

  nats.subscribe('passenger.tickets.use', async ({ hash, ticket }, replyTo) => {
    nats.publish(replyTo, await passengerController.useTicket({ passengerHash: hash, ticket }))
  })
}

module.exports = subscriber
