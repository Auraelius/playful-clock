# Playground to learn the BullMQ queuing library

## architecture

This has a worker process running as root manipulating the raspberry pi and arduinix hardware to display numbers of various sorts on some nixie tubes.

The worker gets its commands via a queue from an express app that allows us to control the nixies from the web using a REST API. The express app also sets up and runs animations on the nixies in response to HTTP requests.

The most basic animation is a clock that updates the nixies once a second. This is the default mode of the system.

## start up

0. Install and start a local copy of redis before using this. check out the command:

`npm run start-redis`

and adjust it to match your installation. (Currently we have a simple install that isn't as secure as we'd like. We'll be moving this to a more secure install and then we'll take away this note.)

1. On raspi this requires that  `arduinix/worker.js` runs as root (so it has permissions to manipulate the hardware GPIO pins).

To start the worker process, use:

`npm run start-worker`

2. Finally, start the express server with:

`npm start`

You should see the nixies begin to display the time if everthing works. :-)
## queue library

More info on the bull/bullmq queue library: https://github.com/taskforcesh/bullmq

This uses bull-board. In chrome, you can see the queues at http://localhost/admin/queues. Bull-board apparently doesn't work on safari, but chrome is ok

More info: https://github.com/vcapretz/bull-board

You can also use bull-repl:

`npm run bull-repl`

More info at [https://github.com/darky/bull-repl|https://github.com/darky/bull-repl]

## logging

To be supplied