const redis = require('redis');

const client = redis.createClient();
const { promisify } = require('util');

const hget = promisify(client.hget).bind(client);
let ready;

client.on('ready', () => {
    console.log('ok');
    ready = true;
});

client.on('error', (e) => {
    console.log(e);
});

const tracking = module.exports = {
    client,

    trackToday: (key) => {
        if (ready) {
            const datePrefix = new Date().toJSON().slice(0, 10).replace(/-/g, '/');

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
                '3.4.1': JSON.parse(await hget(`feedr-${datePrefix}`, 'options:version:3.4.1')) || 0
            }
        };
    },

    isReady: () => ready
};
