
# Graph-engine
Orchestrator using graphs

## Purpose
This engine should be able to orchestrate and manage any known and controllable processes. We understand a process as a certain amount of steps disposed linearly and sequently. In every step we make a decision, which lead us to the next step. Every step request an action. For example:

#### Buying some loaves of bread

1 - We go to the bakery

2 - We ask for an attendance

3 - We choose the type of the bread

4 - We choose how many loaves we want

5 - We wait for them to pack it up

6 - We pay for it

7 - We walk home smiling

It's pretty intuitive and simple when you put it that way, but even buying some loaves is a process. At the first step we are moving in the direction of the bakery. The step won't finish until we arrive the bakery and as soon as you accomplish that starts the second step: asking to be attended. We could divide some of these steps into smaller ones, but I think you got the point.

## Analogy
To better understand how the engine works, we created this analogy with getting a ride on a train.
When you want to go somewhere by train, you have to figure out the itinerary. Think of the process as the itinerary. The itinerary has stations passengers pass by until they get to the destination. Every station has some railways leaving them and leading to them. In order to go, from one station, to the other, we have to jump on train, so we must have a ticket, but in this analogy, the ticket only lead us to the next station. Once we get there we need another ticket.
When you use the ticket to jump on a train, you receive the receipt. The receipt is the leaving-this-station-flag. From the receipt we can figure out which railway you took.

## Getting Started

1. Clone this repo
2. npm i
3. docker-compose up
4. npm start

## API and Routes

Itineraries

GET /itineraries - List of all itineraries
POST /itineraries - Create an itinerary

Passengers

GET /passengers - List of all passengers
POST /passengers - Create a passenger

GET /passengers/{hash} - Specific passenger
POST /passengers/{hash} - Use a ticket in the station the passenger is

GET /passengers/{hash}/tickets - List of available tickets in the station the passenger is

### Using NATS

Connect on port 4222 using NATS lib to command your passenger using messages.

#### Topics

1. passenger.tickets.list
Passing { hash: YOUR-PASSENGER-HASH }, you'll get the list of available tickets

2. passenger.tickets.check
Passing { hash: YOUR-PASSENGER-HASH, ticket: YOUR-TICKET }, you'll check if the ticket you have is valid in the station

3. passenger.tickets.use
Passing { hash: YOUR-PASSENGER-HASH, ticket: YOUR-TICKET }, you'll use the ticket and will receive the receipt of that ticket