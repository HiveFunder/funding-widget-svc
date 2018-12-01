const fs = require('fs').promises;
const path = require('path');
const faker = require('faker');
const db = require('./index.js');

let start = new Date().getTime();
const LIMIT = 1000000;
const CAMPAIGNS_PER_PERSON = 100;
const COUNTRIES = 22; // Index used for lookup tables in front end
const TYPES = 15;
const START_DATE = 1542240000; // November 15, 2018
const DAYS = 90;

// Create CSV columns, 100 campaigns per person 
const writePrimaryData = function writePrimaryData(idx) {
  const data = idx === 0 ? ['campaign,description,author,user,country,pledged,goal,backers,endDate,_type'] : [];
  for (let i = 0; i < LIMIT / CAMPAIGNS_PER_PERSON; i += 1) {
    const first = faker.name.firstName(), last = faker.name.lastName();

    const author = `${first} ${last}`;
    const user = `${first}${Math.floor(Math.random() * 1000)}`;
    const country = Math.floor(Math.random() * COUNTRIES);
    const desc = "Campaign description";

    for (let j = 0; j < CAMPAIGNS_PER_PERSON; j += 1) {
      const name = faker.commerce.productName();
      const goal = Math.floor(Math.random() * 100000) + 50000;
      const pledge = Math.floor(Math.random() * 100) > 50 ? 
        Math.floor(Math.random() * goal) + 100000 : Math.floor(Math.random() * goal);
      const backers = Math.floor(Math.random() * 500);
      const endDate = START_DATE + Math.floor(Math.random() * DAYS + 15) * 86400;
      const type = Math.floor(Math.random() * TYPES);

      data.push(`${name},${desc},${author},${user},${country},${pledge},${goal},${backers},${endDate},${type}`);
    }
  }

  // Insert newline at end
  data.push('');

  console.log(`Generated ${LIMIT} entries in ${new Date().getTime() - start} ms`);

  // Write the entries to a CSV file
  start = new Date().getTime();
  return fs.writeFile('db/largeData.csv', data.join('\n'), { flag: 'a' })
    .then((result) => {
      console.log(`Wrote ${LIMIT} entries in ${new Date().getTime() - start} ms`);
    })
    .catch((err) => { console.error(err) });
};

// Write pledge data for LIMIT / 10 campaigns, each one has 100 backers
const writePledgeData = function writePledgeData(i) {
  const data = ['name,pledge,pledgeTime,campaignIdx'];
  const CAMPAIGN_LIMIT = LIMIT / 100;
  const startIdx = CAMPAIGN_LIMIT * i, endIdx = CAMPAIGN_LIMIT * (i + 1);

  for (let k = startIdx; k < endIdx; k += 1) {
    for (let j = 0; j < 50; j += 1) {
      const name = faker.name.findName();
      const pledge = Math.floor(Math.random() * 100) + 1;
      const pledgeTime = START_DATE + Math.floor(Math.random() * DAYS) * 86400;

      data.push(`${name},${pledge},${pledgeTime},${k}`);
    }
  }

  // Insert newline at end
  data.push('');

  console.log(`Generated ${CAMPAIGN_LIMIT * 50} entries in ${new Date().getTime() - start} ms`);

  // Write the entries to a CSV file
  start = new Date().getTime();
  return fs.writeFile(`db/pledgeData_${i}.csv`, data.join('\n'), { flag: 'w' })
    .then((result) => {
      console.log(`Wrote ${CAMPAIGN_LIMIT * 50} entries in ${new Date().getTime() - start} ms`);
    })
    .catch((err) => { console.error(err) });
};

async function seedPostgresData() {
  let csvFile = path.resolve(__dirname, './largeData.csv');
  if (process.platform === 'win32') {
    csvFile = csvFile.replace(/\\/g, '/');
  }

  start = new Date().getTime();

  // Create campaign table, load to DB
  await db.query(`CREATE TABLE IF NOT EXISTS campaigns (id SERIAL PRIMARY KEY, campaign TEXT, description TEXT, author TEXT, _user TEXT, country SMALLINT, pledged INT,
    goal INT, backers INT, endDate INT, _type SMALLINT);`)
    .catch((err) => { console.error(err); });
  await db.query(`COPY campaigns(campaign, description, author, _user, country, pledged, goal, backers, endDate, _type) FROM '${csvFile}' CSV HEADER;`)
    .catch((err) => { console.error(err); });

  console.log(`Seeded campaigns in ${new Date().getTime() - start} ms`);

  start = new Date().getTime();

  // Create and fill pledges table
  await db.query(`CREATE TABLE IF NOT EXISTS pledges (id SERIAL PRIMARY KEY, name TEXT, pledge SMALLINT, pledgeTime INT, campaignIdx INT);`)
    .catch((err) => { console.error(err) });

  for (let i = 0; i < 100; i++) {
    let csvFile = path.resolve(__dirname, `./pledgeData_${i}.csv`);
    if (process.platform === 'win32') {
      csvFile = csvFile.replace(/\\/g, '/');
    }
    await db.query(`COPY pledges(name, pledge, pledgeTime, campaignIdx) FROM '${csvFile}' CSV HEADER;`)
      .catch((err) => { console.error(err) });
  }

  console.log(`Seeded pledges in ${new Date().getTime() - start} ms`);
  
  // Create indices for country, type, author
  await db.query('CREATE INDEX campaigns_type_idx ON campaigns(_type);');
  await db.query('CREATE INDEX campaigns_country_idx ON campaigns(country);');
  await db.query('CREATE INDEX campaigns_user_idx ON campaigns(_user);');
  
  db.end();
}

// Create CSV files with up to 10 million entries of campaigns (projects) and 50 million pledges
async function writeAndSeed() {
  for (let i = 0; i < 10; i++) {
    await writePrimaryData(i);
  }
  for (let i = 0; i < 100; i++) {
    await writePledgeData(i);
  }

  await seedPostgresData();
};

writeAndSeed();
