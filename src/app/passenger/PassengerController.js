class PassengerController {
  
  constructor({ manager }) {
    this.manager = manager
  }
  
  async createPassenger(o) {
    return await this.manager.createPassenger(passenger)
  }

  async checkPassengerTicket({ passengerHash, ticket }) {
    return await this.manager.checkTicket({ hash: passengerHash, ticket })
  }

  async getValidTicketsList({ passengerHash }) {
    return await this.manager.getTickets({ hash: passengerHash })
  }

  async useTicket({ passengerHash, ticket }) {
    return await this.manager.movePassenger({ hash: passengerHash, ticket })
  }
  
}

module.exports = PassengerController