var Meetup = require('meetup')
var mup = new Meetup()

let topicsCounter = {}

mup.stream('/2/rsvps', stream => {
  stream
  .on('data', item => {
    console.log('got item ' + item)

    // inside of our stream event handler (!) we retrieve the group topics
    const topicNames = item.group.group_topics.map(topic => topic.topic_name)
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
    console.log(arrayOfTopics.slice(0,10))
  }).on('error', e => {
    console.log('error! ' + e)
  });
});
