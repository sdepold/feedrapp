const redis = require("async-redis");

let client = createClient();
let ready;

module.exports = {
  getClient() {
    return ready && client;
  }
};

function createClient() {
  const result = redis.createClient({
    retry_strategy: () => {
      ready = false;

      console.log("No redis server available.");
      setTimeout(() => {
        client = createClient();
      }, 10000);
    }
  });

  result.on("ready", () => {
    console.log("Redis cache is now available...");
    ready = true;
  });

  result.on("error", e => {
    console.log(e);
    ready = false;
    client = createClient();
  });

  return result;
}
