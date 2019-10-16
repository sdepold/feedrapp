const redis = require("redis");

const client = redis.createClient();
const { promisify } = require("util");

const hget = promisify(client.hget).bind(client);
const hkeys = promisify(client.hkeys).bind(client);
const hgetall = promisify(client.hgetall).bind(client);
let ready;

client.on("ready", () => {
  console.log("ok");
  ready = true;
});

client.on("error", e => {
  console.log(e);
});

const tracking = (module.exports = {
  client,

  trackToday: key => {
    if (ready) {
      const datePrefix = new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "/");

      tracking.track(`feedr-${datePrefix}`, key);
    }
  },

  track: (setName, key) => {
    if (ready) {
      client.hincrby(setName, key, 1);
    }
  },

  get: async (setName, key) => {
    return await hget(setName, key);
  },

  getDataFor: async date => {
    const datePrefix = date
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
    const feedrDateKey = `feedr-${datePrefix}`;

    if (!ready) {
      return null;
    }

    const supporters = JSON.parse(
      await hget(feedrDateKey, "options:support:true")
    );
    const supporterRequests =
      JSON.parse(await hget(feedrDateKey, "supportRequest")) || 0;
    const nonSupporters = JSON.parse(
      await hget(feedrDateKey, "options:support:disabled")
    );
    const totalRequests = (supporters || 0) + (nonSupporters || 0);
    const servedAds = JSON.parse(await hget(feedrDateKey, "ad:served")) || 0;
    const versionKeys = await hgetall(feedrDateKey);
    const versions = Object.entries(versionKeys || {}).reduce(
      (acc, [key, value]) =>
        key.startsWith("options:version") ? { ...acc, [key]: value } : acc,
      {}
    );

    return {
      supporters,
      supporterRequests,
      totalRequests,
      servedAds,
      versions
    };
  },

  isReady: () => ready
});
