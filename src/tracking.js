const redis = require("redis");

const client = redis.createClient();
const { promisify } = require("util");

const keys = promisify(client.keys).bind(client);
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

  async getSupportersOverTime() {
    const addColors = arr => {
      const colors = [
        "#45B39D",
        "#2471A3",
        "#943126",
        "#2C3E50",
        "#F1C40F",
        "#145A32",
        "#1C2833",
        "#7B7D7D",
        "#BFC9CA",
        '#E6B0AA',
        '#A9DFBF',
        '#566573'
      ];

      return arr.map((o, i) => ({ ...o, borderColor: colors[i] }));
    };
    const readValues = (values, prop) => {
      return Promise.all(values.map(async key => await hget(key, prop)));
    };
    const values = (await keys("*"))
      .filter(k => k.startsWith("feedr-20"))
      .sort();
    const servedAds = await readValues(values, "ad:served");
    const supportRequests = await readValues(values, "supportRequest");
    const versionKeys = (await Promise.all(
      values.map(async key => await hgetall(key))
    )).reduce((acc, keys) => {
      Object.keys(keys)
        .filter(k => k.startsWith("options:version"))
        .forEach(k => (acc = acc.includes(k) ? acc : acc.concat(k)));
      return acc;
    }, []);
    const versions = await Promise.all(
      versionKeys.map(async versionKey => {
        return {
          label: versionKey.replace("options:version:", "v"),
          data: await readValues(values, versionKey),
          hidden: true
        };
      })
    );

    return {
      labels: values,
      datasets: addColors([
        { label: "servedAds", data: servedAds },
        { label: "supportRequests", data: supportRequests, hidden: true },
        ...versions
      ])
    };
  },

  isReady: () => ready
});
