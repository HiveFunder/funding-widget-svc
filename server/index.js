const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Models = require('../db/models.js');
const db = require('../db');

const port = 3002;
const app = express();

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow CORS for a given endpoint
const allowCORS = function(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

// TODO: Handles HTML requests for a given ID, will be routed by React Router
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
app.get('/api/:campaign/stats', (req, res) => {
  allowCORS(res);
  const campaign = Number.parseInt(req.params.campaign, 10);

  if (Number.isNaN(campaign)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: 'Campaign is not a number' }));
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

// FIXME: Need to regenerate seeded data to include author ID and a username, not just proper name
app.get('/api/:username/campaigns', (req, res) => {
  allowCORS(res);
  Models.getCampaignsByAuthor(db, req.params.username)
  .then((result) => {
    res.status(200).type('application/json');
    res.send(JSON.stringify(result));
  }).catch((err) => {
    res.status(500).type('Sorry, an error occurred!');
  });
});

// U endpoints
app.patch('/api/:campaign/stats', (req, res) => {
  allowCORS(res);
  const campaign = Number.parseInt(req.params.campaign, 10);

  if (Number.isNaN(campaign)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: 'Campaign is not a number' }));
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

app.put('/api/:campaign/stats', (req, res) => {
  allowCORS(res);
  const campaign = Number.parseInt(req.params.campaign, 10);

  if (Number.isNaN(campaign)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: 'Campaign is not a number' }));
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
app.delete('/api/:campaign/stats', (req, res) => {
  allowCORS(res);
  const campaign = Number.parseInt(req.params.campaign, 10);

  if (Number.isNaN(campaign)) {
    res.status(400).type('application/json');
    res.send(JSON.stringify({ success: false, error: 'Campaign is not a number' }));
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

