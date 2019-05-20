const example = require('./itinerary_example')
const Database = require('./../infra/DB')

const DB = new Database()


async function test() {
  const newVertex = await DB.createVertex('v15')
  const stations = await Promise.all(example.stations.map(async (s) => {
    return await DB.createVertexRecord('v15', s)
  }))
  let edges = []
  stations.forEach(s => {
    if (s.railways) {
      s.railways.forEach(async (r) => {
        const railway = example.railways.find(rail => rail.name === r)
        const destiny = stations.find(st => st.name === railway.destination)
        console.log(s, railway)
        const from = `#${s['@rid'].cluster}:${s['@rid'].position}`
        const to = `#${destiny['@rid'].cluster}:${destiny['@rid'].position}`
        const new_railway = await DB.createEdgeRecord('e15', from, to, railway)
        console.log(s, r, from, to)
        edges.push(new_railway);
      })
    }
  })
  console.log(stations)
  console.log(edges)
}

test()