const TS = 'TS'
const BOARD = 'board'
const TEMPERATURE = 'temperature'
const REGISTER = 'register'
const RESP = 'resp'
const REQ = 'req'

module.exports = {
  constants: {
    TS,
    BOARD,
    TEMPERATURE,
    REGISTER,
    REQ,
    RESP
  },
  mqtt: {
    url: process.env.MQTT_URL || 'mqtt://localhost',
    username: process.env.MQTT_USER || 'user',
    password: process.env.MQTT_PASS || 'password',
    port: process.env.MQTT_PORT || 13235
  },
  mongo: {
    url: process.env.MONGO_URL || 'localhost',
    user: process.env.MONGO_USER || 'user',
    password: process.env.MONGO_PASS || 'password',
    port: process.env.MONGO_PORT || 13455,
    database: process.env.MONGO_DB || 'nodemcu_db'
  },
  services: [
    // TODO: move this to db
    { name: 'temperature', type: 'ts', subscribe: true, timer: 30000 },
    { name: 'register', type: 'board', subscribe: true }
    // { name: 'status', type: 'read' }
    // { name: 'sensor', type: 'read' }
    // { name: 'water', type: 'toggle', timer: 10000 },
    // { name: 'light', type: 'read/write' }
    // boundaries min...max
  ]
}
