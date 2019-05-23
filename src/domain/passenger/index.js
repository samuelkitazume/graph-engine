class Passenger {
  constructor ({ name='', hash, description='', itinerary, path, station, ...props }) {
    this.name = name
    this.hash = hash
    this.description = description
    this.itinerary = itinerary
    this.path = path
    this.station = station
    this.linkToStation = props.out_passenger_link.toJSON()[0];
  }
  setRailwayToStation(railway={}) {
    this.railwayToStation = railway
  }
}