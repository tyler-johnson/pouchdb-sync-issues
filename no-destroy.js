const PouchDB = require("pouchdb-core");
const replicationPlugin = require("pouchdb-replication");
const httpAdapter = require("pouchdb-adapter-http");
const memoryAdapter = require("pouchdb-adapter-memory");

PouchDB
  .plugin(httpAdapter)
  .plugin(memoryAdapter)
  .plugin(replicationPlugin);

PouchDB.debug.enable("*");
const remote = new PouchDB("http://localhost:5984/test");
const local = new PouchDB("test");

const sync = PouchDB.sync(remote, local, {
  live: true
});

new Promise((resolve, reject) => {
  sync.on("paused", (err) => {
    if (err) console.log("paused error", err);
    resolve();
  });

  sync.on("error", reject);
}).then(() => {
  sync.cancel();

  // close? although probably does nothing
  local.close();
  remote.close();
});
