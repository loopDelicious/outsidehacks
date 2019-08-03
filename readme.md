# Outside Lights:

[![GitHub](https://img.shields.io/github/license/loopDelicious/outsidehacks)](/LICENSE)

## turn your phone into a synchronized light show
Developed in 24 hours for the Outside Hacks hackathon, we set out to build something that enhances the experience for Artists and/or Fans at Outside Lands music festival. Using web sockets, DJ's can interact with the audience, pushing changes in background color and animations based on GPS location of the audience member's phone.

- Color
- BPM
- Pulse brightness
- Speed of propagation

## setup
`npm install -g nodemon`

`webpack -d --watch`

## techstack
- node.js
- HTML5
- socket.io
- React
- jQuery
- webpack

Musical artists on stage can control the color, beats per minute, pulse brightness, and speed of propagation (from the stage throughout the crowd):

![DJ](https://github.com/loopDelicious/outsidehacks/blob/master/static/Screen%20Shot%202016-07-25%20at%2011.19.58%20AM.png)

Audience members can chat real-time with others at the same stage:

![client](https://github.com/loopDelicious/outsidehacks/blob/master/static/IMG_3594.PNG)
