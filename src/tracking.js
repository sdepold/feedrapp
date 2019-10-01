const redis = require("redis");
const client = redis.createClient();

let ready;

client.on('ready', () => {
    console.log('ok')
    ready = true;
});

client.on('error', (e) => {
    console.log(e);
});

module.exports = {
    track: (key) => {
        if (ready) {
            const datePrefix = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

            client.hincrby(`feedr-${datePrefix}`, key, 1);
        }
    }
};