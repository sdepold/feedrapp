const redis = require("redis");
const client = redis.createClient();
const { promisify } = require('util');

const hget = promisify(client.hget).bind(client);
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
    },

    getDataFor: async (date) => {
        const datePrefix = date.toJSON().slice(0, 10).replace(/-/g, '/');

        if (!ready) {
            return null;
        }

        const supporters = JSON.parse(await hget(`feedr-${datePrefix}`, 'options:support:true'));
        const nonSupporters = JSON.parse(await hget(`feedr-${datePrefix}`, 'options:support:disabled'));
        const totalRequests = (supporters || 0) + (nonSupporters || 0);

        return {
            supporters,
            totalRequests,
            versions: {
                unknown: JSON.parse(await hget(`feedr-${datePrefix}`, 'options:version:unknown')) || 0,
                '3.4.0': JSON.parse(await hget(`feedr-${datePrefix}`, 'options:version:3.4.0')) || 0,
                '3.4.1': JSON.parse(await hget(`feedr-${datePrefix}`, 'options:version:3.4.1')) || 0,
            }
        }
    }
};