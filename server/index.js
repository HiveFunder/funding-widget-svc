require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Models = require('../db/models.js');
const db = require('../db');

const port = 80;
const app = express();

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow CORS for a given endpoint
const allowCORS = function(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

const parseIntFromBase64 = function(base64) {
  return Number.parseInt(Buffer.from(base64, 'base64').toString(), 10);
}

app.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// C endpoint
app.post('/api/new/stats', (req, res) => {
  allowCORS(res);
  Models.addCampaign(db, req.body)
  .then((result) => {
    res.status(201).type('application/json');
    res.send(JSON.stringify(result));
  }).catch((err) => {
    res.status(500).type('Sorry, an error occurred!');
  });
});

// R endpoints
app.get('/api/:base64/stats', (req, res) => {
  allowCORS(res);
  const campaign = parseIntFromBase64(req.params.base64);

  if (Number.isNaN(campaign)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: 'Campaign ID is not valid' }));
  } else {
    Models.getCampaignById(db, campaign)
    .then((result) => {
      res.status(200).type('application/json');
      res.send(JSON.stringify(result));
    }).catch((err) => {
      res.status(500).type('Sorry, an error occurred!');
    });
  }
});

app.get('/api/:user/campaigns', (req, res) => {
  allowCORS(res);
  Models.getCampaignsByUser(db, req.params.user)
  .then((result) => {
    res.status(200).type('application/json');
    res.send(JSON.stringify(result));
  }).catch((err) => {
    res.status(500).type('Sorry, an error occurred!');
  });
});

// U endpoints
app.patch('/api/:base64/stats', (req, res) => {
  allowCORS(res);
  const campaign = parseIntFromBase64(req.params.base64);

  if (Number.isNaN(campaign)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: 'Campaign ID is not valid' }));
  } else {
    Models.pledgeCampaign(db, campaign, req.body)
    .then((result) => {
      res.status(200).type('application/json');
      res.send(JSON.stringify(result));
    }).catch((err) => {
      res.status(500).type('Sorry, an error occurred!');
    });
  }
});

app.put('/api/:base64/stats', (req, res) => {
  allowCORS(res);
  const campaign = parseIntFromBase64(req.params.base64);

  if (Number.isNaN(campaign)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: 'Campaign ID is not valid' }));
  } else {
    Models.updateCampaign(db, campaign, req.body)
    .then((result) => {
      res.status(200).type('application/json');
      res.send(JSON.stringify(result));
    }).catch((err) => {
      res.status(500).type('Sorry, an error occurred!');
    });
  }
});

// D endpoint
app.delete('/api/:base64/stats', (req, res) => {
  allowCORS(res);
  const campaign = parseIntFromBase64(req.params.base64);

  if (Number.isNaN(campaign)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: 'Campaign ID is not valid' }));
  } else {
    Models.deleteCampaign(db, campaign)
    .then((result) => {
      res.status(200).type('application/json');
      res.send(JSON.stringify(result));
    })
    .catch((err) => {
      res.status(500).type('Sorry, an error occurred!');
    });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${port}`);
});

