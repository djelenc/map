console.log("Server is up!");

const zmq = require('zmq');

const dealer = zmq.socket('dealer');
dealer.identity = "ccc_quick_maps";
dealer.connect('tcp://127.0.0.1:5550');

dealer.on('message', (sender, type, id, message) => {
  console.log("Received: " +
              sender + " | " +
              type + " | " +
              id + " | " +
              JSON.parse(message));
});

Meteor.methods({
  uploadMap(recipient, payload) {
    const type = 4;
    const id = Math.floor(Math.random() * 2147483647);
    dealer.send([recipient, type, id, JSON.stringify(payload)]);
  }
});
