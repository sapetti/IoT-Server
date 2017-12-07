// MQTT

const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://server', {
    username: 'username', 
    password: 'password',
    port: 1883
})

client.on('connect', () => {
    // Try subscribing to a topic and sending a message for it
    client.subscribe('hello')
    client.publish('hello', 'world')
})

client.on('message', (topic, message) => {
    // Display the message and disconnect
    console.log(message.toString())
    client.end()
})
