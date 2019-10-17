#!/usr/bin/env node

const { execSync } = require('child_process');
const axios = require('axios');
const { writeFileSync } = require('fs');

const lines = execSync('pm2 logs --lines=50 --raw --nostream --out').toString().split('\n');

lines.map((line) => {
  return line.match(/.*q=(.*): /)
})
.filter(match => !!match && !match[1].startsWith('undefined'))
.map(match => match[1])
.map(async url => {
  const q = decodeURIComponent(url.match(/[^&]*/)[0]);
  const filename = url.replace(/[^a-zA-Z1-9]/g, '');
  const response = await axios.get(q);
  const parsed = await axios.get(`https://feedrapp.info?q=${url}`);

  console.log('Saving data for ' + filename);
console.log(parsed.data)


  writeFileSync(__dirname + '/../test/integration/fixtures/' + filename + '.source.xml', response.data);
  writeFileSync(__dirname + '/../test/integration/fixtures/' + filename + '.parsed.json', JSON.stringify(parsed.data, null, 2));
});
