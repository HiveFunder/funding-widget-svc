const fs = require('fs');
const faker = require('faker');
const Path = require('path');
const moment = require('moment');
const db = require('./connection.js');

let filePath = Path.resolve(__dirname, './seedData.csv');

// if in windows, replace all \ with /
if (process.platform === 'win32') {
  filePath = filePath.replace(/\\/g, '/');
}

// a series of query strings to send the database
const createDatabase = 'CREATE DATABASE IF NOT EXISTS funding_stats;';
const useDatabase = 'USE funding_stats;';
const createTable = `CREATE TABLE IF NOT EXISTS campaigns (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                     pledged DECIMAL(11, 2),
                     goal DECIMAL(11, 2),
                     backers INT,
                     media VARCHAR(100),
                     category VARCHAR(20),
                     city VARCHAR(40),
                     state CHAR(2),
                     currency CHAR(3),
                     country VARCHAR(40),
                     deadline VARCHAR(50));`;

const clearTable = 'TRUNCATE campaigns;';
const writeData = `LOAD DATA LOCAL INFILE '${filePath}' INTO TABLE campaigns
                   COLUMNS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
                   (pledged, goal, backers, media, category, city, state, currency, country, deadline);`;

let fakeRows = ''; // a variable to contain my comma-separated data
const currCodes = ['USD', 'GBP', 'CAD', 'AUD', 'NZD', 'EUR', 'DKK',
  'NOK', 'SEK', 'CHF', 'HKD', 'SGD', 'MXN', 'JPY']; // the currency codes accepted by Kickstand

const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand',
  'Netherlands', 'Denmark', 'Ireland', 'Norway', 'Sweden', 'Germany',
  'France', 'Spain', 'Italy', 'Austria', 'Belgium', 'Switzerland', 'Luxembourg',
  'Hong Kong', 'Singapore', 'Mexico', 'Japan']; // the accepted countries of origin for campaigns

const dateGen = () => moment(faker.date.future()).format('YYYY-MM-DD');

for (let i = 0; i < 100; i += 1) {
  // assemble random comma-separated data strings
  fakeRows += faker.fake('{{commerce.price}},{{commerce.price}},{{random.number}},{{image.image}},');
  fakeRows += faker.fake('{{commerce.product}},{{address.city}},{{address.stateAbbr}},');
  // append data not handled by faker directly
  fakeRows += currCodes[Math.floor(Math.random() * currCodes.length)];
  fakeRows += ',';
  fakeRows += countries[Math.floor(Math.random() * countries.length)];
  fakeRows += ',';
  fakeRows += dateGen();
  fakeRows += '\n'; // terminate each line with a newline
}

fs.writeFile(filePath, fakeRows, (err) => { // write CSV
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
});

db.connect((error) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
});
// write mock data .csv into db
db.query(createDatabase + useDatabase + createTable + clearTable + writeData);

db.end();
