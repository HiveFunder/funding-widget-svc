const fs = require('fs').promises;
const path = require('path');

let filePath = path.resolve(__dirname, './seedData.csv');

// if in windows, replace all \ with /
if (process.platform === 'win32') {
  filePath = filePath.replace(/\\/g, '/');
}

// Lookup tables
// the currency codes accepted by Kickstand
const currCodes = ['USD', 'GBP', 'CAD', 'AUD', 'NZD', 'EUR', 'DKK',
  'NOK', 'SEK', 'CHF', 'HKD', 'SGD', 'MXN', 'JPY'];

// the accepted countries of origin for campaigns
const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand',
  'Netherlands', 'Denmark', 'Ireland', 'Norway', 'Sweden', 'Germany',
  'France', 'Spain', 'Italy', 'Austria', 'Belgium', 'Switzerland', 'Luxembourg',
  'Hong Kong', 'Singapore', 'Mexico', 'Japan'];
  
const types = ['Art', 'Comics', 'Crafts', 'Dance', 'Design', 'Fashion', 'Film & Video',
  'Food', 'Games', 'Journalism', 'Music', 'Photography', 'Publishing', 'Technology', 'Theater'];
  
let start = new Date().getTime();

const LIMIT = 100000;
const START_DATE = 1542240000; // November 15, 2018

// Create CSV columns. Use template literals to avoid string concatenation
const writePrimaryData = function writePrimaryData() {
  const data = [];
  for (let i = 0; i < LIMIT; i += 1) {
    const name = "Campaign name";
    const desc = "Campaign description";
    const author = "Author";
    const currency = currCodes[Math.floor(Math.random() * currCodes.length)];
    const pledgeGoal = Math.floor(Math.random() * 100000) + 50000;
    const pledge = Math.floor(Math.random() * pledgeGoal);
    const backers = Math.floor(Math.random() * 500);
    const endDate = START_DATE + Math.floor(Math.random() * 30 + 15) * 86400;
    const country = Math.floor(Math.random() * countries.length);
    const type = Math.floor(Math.random() * types.length);

    data.push(`${name}, ${desc}, ${author}, ${currency}, ${pledgeGoal}, ${pledge}, ${backers}, ${endDate}, ${country}, ${type}`);
  }

  console.log(`Generated ${LIMIT} entries in ${new Date().getTime() - start} ms`);

  // Write the entries to a CSV file
  start = new Date().getTime();

  return fs.writeFile('largeData.csv', data.join('\n'), { flag: 'a' })
    .then((result) => {
      console.log(`Wrote ${LIMIT} entries in ${new Date().getTime() - start} ms`);
    })
    .catch((err) => { throw err; });
};

// Write pledge data for LIMIT / 10 campaigns, each one has 100 backers
const writePledgeData = function writePledgeData(i) {
  const data = [];
  const CAMPAIGN_LIMIT = LIMIT / 10;
  const startIdx = CAMPAIGN_LIMIT * i, endIdx = CAMPAIGN_LIMIT * (i + 1);

  for (let k = startIdx; k < endIdx; k += 1) {
    for (let j = 0; j < 100; j += 1) {
      const name = "Pledger name";
      const pledge = Math.floor(Math.random() * 100) + 1;
      const pledgeTime = START_DATE + Math.floor(Math.random() * 30) * 86400;

      data.push(`${name}, ${pledge}, ${pledgeTime}, ${k}`);
    }
  }

  console.log(`Generated ${CAMPAIGN_LIMIT * 100} entries in ${new Date().getTime() - start} ms`);

  // Write the entries to a CSV file
  start = new Date().getTime();

  return fs.writeFile(`pledgeData_${i}.csv`, data.join('\n'), { flag: 'w' })
    .then((result) => {
      console.log(`Wrote ${CAMPAIGN_LIMIT * 100} entries in ${new Date().getTime() - start} ms`);
    })
    .catch((err) => { throw err; });
};

async function writeAllData() {
  for (let i = 0; i < 10; i++) {
    await writePrimaryData();
  }
  
  for (let i = 0; i < 10; i++) {
    await writePledgeData(i);
  }
}

writeAllData();