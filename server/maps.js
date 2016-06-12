const zmq = require('zmq');

const IDENTITY = "ccc_quick_maps";
const ADDRESS = "127.0.0.1";
const PORT = 5550;

const dealer = zmq.socket('dealer');
dealer.identity = IDENTITY;
dealer.connect('tcp://' + ADDRESS + ":" + PORT);

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
    dealer.send([recipient, type, id, payload]);
  }
});
