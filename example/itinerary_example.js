const railway = (name, trigger, bullet, destination) => Object.assign({}, { name, trigger, bullet, destination })
const station = (name, railways, initial=false) => Object.assign({}, { name, railways, initial })

const example = {
  name: 'example of itinerary',
  description: 'Lorem ipsum dolor sit amet',
  railways: [
    railway('railway1', 'trigger1', 'bullet1', 'station2'),
    railway('railway2', 'trigger2', 'bullet2', 'station3'),
    railway('railway3', 'trigger3', 'bullet3', 'station4'),
    railway('railway4', 'trigger4', 'bullet4', 'station5'),
    railway('railway5', 'trigger5', 'bullet5', 'station6'),
    railway('railway6', 'trigger6', 'bullet6', 'station7'),
    railway('railway7', 'trigger7', 'bullet7', 'station7'),
    railway('railway8', 'trigger8', 'bullet8', 'station8'),
    railway('railway9', 'trigger9', 'bullet9', 'station8'),
  ],
  stations: [
    station('station1', ['railway1', 'railway2'], true),
    station('station2', ['railway3', 'railway4']),
    station('station3', ['railway5']),
    station('station4', ['railway6']),
    station('station5', ['railway7']),
    station('station6', ['railway9']),
    station('station7', ['railway8']),
    station('station8'),
  ]
}

module.exports = example