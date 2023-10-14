const adsConfig = require('../../config/ads.json');
const requestIp = require('request-ip');
const { getIPRange } = require('get-ip-range');

function getClientIp(req) {
  if (Math.random() < adsConfig.anonChance) {
    return requestIp.getClientIp(req);
  }

  const ipRange =
    adsConfig.ipRanges[~~(Math.random() * adsConfig.ipRanges.length)];
  const ips = getIPRange(ipRange);
  return ips[~~(Math.random() * ips.length)];
}

module.exports = { getClientIp };
