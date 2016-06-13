const zmq = require('zmq');

const IDENTITY = "ccc_quick_maps";
const ADDRESS = "172.15.16.4";
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
    const id = Math.floor(Math.random() * 2147483647);

    const rpc = {
      jsonrpc: "2.0",
      id: id,
      method: "route_on",
      params: {
        "path": payload
      }
    };

    dealer.send([recipient,'\x02', id, JSON.stringify(rpc)]);
  }
});
