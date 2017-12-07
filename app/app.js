const broker = require('./broker'),
  { mqtt, mongo, services, constants } = require('./config'),
  model = require('./model'),
  router = require('./router')

module.exports = function main() {
  let data = {}
  let timers = {}
  let boards = []

  const getMillis = () => new Date().getTime()
  const isRegistered = id => (boards.indexOf > -1 ? true : false)

  function timeseries(id, service, value) {
    const tag = `${id}-${service}`
    console.log(tag, value, data[tag])
    //Skip values if doesn`t change
    if (data[tag] !== value) {
      console.log('Message received', id, value)
      model.writeData(tag, { t: getMillis(), v: value })
      data[tag] = value
    }
  }

  function setupCronJob({ name: service, timer }) {
    console.log('Generating cron job for', service)
    timers[service] = setInterval(() => {
      broker.publish(service + constants.REQ, '')
    }, timer)
  }

  function registerBoard({ id, name, place }) {
    console.log(constants.REGISTER, id, name, place)
    model
      .writeData(constants.BOARD, { id, name, place })
      .then(() => boards.push(id))
  }

  function subscribeService({ name: service, type }) {
    console.log(service)
    broker.subscribe(service + constants.RESP, message => {
      if (type === constants.TS && isRegistered(id)) {
        // Persist value in TimeSeries
        const { id, value } = JSON.parse(message)
        timeseries(id, service, value)
      } else if (type === constants.BOARD && !isRegistered(id)) {
        // Register board in db
        registerBoard(JSON.parse(message))
      }
    })
  }

  // Setup db connection
  model
    .init(mongo)
    // Setup broker connection
    .then(() => broker.init(mqtt))
    // Retrieve already registered boards
    .then(() => model.readData(constants.BOARD, {}))
    .then(dbBoards => (boards = [].concat(dbBoards)))
    // Initialize Router
    .then(() => router.init(model))
    // Subscribe to handle the data send by the boards
    // ie: TS type service will store the data in the TimeSeries service
    .then(() =>
      services.filter(({ subscribe }) => subscribe).forEach(subscribeService)
    )
    // If timer is defined, setup CronJobs to request data for every
    // 'timer' milliseconds.
    .then(() => services.filter(({ timer }) => timer).forEach(setupCronJob))
}
