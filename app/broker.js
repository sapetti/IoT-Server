const mqtt = require('mqtt')
const Promise = require('bluebird')

module.exports = (function() {
  let client = null
  let connected = false
  let subscriptions = {}

  function _init({ url, username, password, port }) {
    return new Promise((resolve, reject) => {
      if (!url || !username || !password || !port)
        reject(
          'MQTT: Review your connection, there is at least one option missing (url, username, password or port)'
        )

      console.log('MQTT: Estabilishing connection with MQTT server')
      client = mqtt.connect(url, {
        username,
        password,
        port
      })

      client.on('connect', () => {
        console.log('MQTT: Connection to the server successful')
        connected = true
        resolve()
      })

      //TODO: handle disconnection

      client.on('message', (topic, message) => {
        console.log('MQTT: Message received: ', topic)
        if (!subscriptions[topic]) {
          //This should never happen... skip message action but log the error
          console.error(
            'MQTT: Unsubscribed topic',
            topic,
            JSON.stringify(message)
          )
        } else {
          //Let the onMessage function provided handle the message content
          subscriptions[topic](message)
        }
      })
    })
  }

  function _publish(topic, message) {
    return new Promise((resolve, reject) => {
      console.log('MQTT: Publishing message for', topic)
      client.publish(topic, message)
      resolve()
    })
  }

  function _subscribe(topic, onMessage) {
    return new Promise((resolve, reject) => {
      console.log('MQTT: Subscribing to', topic)
      client.subscribe(topic)
      subscriptions[topic] = onMessage
      resolve()
    })
  }

  return {
    init: _init,
    publish: _publish,
    subscribe: _subscribe
  }
})()
