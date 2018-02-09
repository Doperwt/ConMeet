var Meetup = require('meetup')
var mup = new Meetup()
var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

server.listen(3002)

let topicsCounter = {}
let arrayOfTopicsWithCount = {}
console.log('no connection')

mup.stream('/2/rsvps', stream => {
  stream
  .on('data', item => {
    console.log('got event ' + item.event.event_name)

    // inside of our stream event handler (!) we retrieve the group topics
    const topicNames = item.group.group_topics.map(topic => topic.topic_name)
    if(!topicNames.includes('Software Development')) return
    topicNames.forEach(name => {
      if (topicsCounter[name]) {
        topicsCounter[name]++
      }
      else {
        topicsCounter[name] = 1
      }
    })
    const arrayOfTopics = Object.keys(topicsCounter)
    arrayOfTopics.sort((topicA, topicB) => {
      if (topicsCounter[topicA] > topicsCounter[topicB]) {
        return -1
      }
      else if (topicsCounter[topicB] > topicsCounter[topicA]) {
        return 1
      }
      else {
        return 0
      }
    })

    let top10 = arrayOfTopics.slice(0,10)
    arrayOfTopicsWithCount = top10.map(topic =>   { return {topic:topic,count:topicsCounter[topic]}})
    console.log('update top10')
    io.emit('action', arrayOfTopicsWithCount)
  }).on('error', e => {
    io.emit('error! ' + e)
  })
})

io.on('connection', socket => {
  socket.emit('action',arrayOfTopicsWithCount)
  console.log('got connection')
})
