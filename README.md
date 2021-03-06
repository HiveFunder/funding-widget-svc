# HiveFunder

> A detail page for a crowd-funding campaign

## Related Projects
  - https://github.com/HiveFunder/comments-module
  - https://github.com/HiveFunder/support-module-svc
  - https://github.com/HiveFunder/updates-service

## Setup Instructions
To seed data for this project, first run `node db/largeDataGenAndSeed.js`, then run the bash shell script `./db/mongoSeed.sh`, both of which from the project root.
If your laptop has an SSD, it should take no more than 30 minutes to generate and seed everything!

## CRUD Documentation

### Data Shape
  - Campaign: Campaign name, description, author, username, country, pledge amount, pledge goal, backers, end date, type
  - Pledge: username, pledge amount, date

### Page Endpoint
/:user/:campaignId/

### GET - /api/:campaign/stats
  - Get stats from a single campaign, for an item detail view.
  - Query format: Campaign ID (number)
  - Response data shape: Refer to Campaign data shape above
  - Error code: 400 for invalid author or campaign

### GET - /api/:user/campaigns
  - Get all campaigns for given author (user)
  - Query format: campaign user (string)
  - Response data shape: Array of all Campaigns from author
  - Error code: 400 for invalid author

### POST - /api/new/stats
  - Creates a new campaign.
  - Body data shape: Campaign name, description, author, currency, pledge goal, end date, type, location
  - Error code: 400 if any fields in the body are missing

### ( Backlog ) POST - /api/:campaign/pledge
  - Creates a new pledge for a given campaign.
  - Query format: Campaign ID (number)
  - Body data shape: Refer to Pledge data shape above
  - Error code: 400 for invalid author or campaign

### PATCH - /api/:campaign/stats
  - Updates an existing campaign pledge amount and numbers
  - Query format: Campaign ID (number)
  - Body data shape: Pledge amount, new pledges
  - Error code: 400 for invalid author or campaign

### PUT - /api/:campaign/stats
  - Updates an existing campaign.
  - Query format: Campaign ID (number)
  - Body data shape: Refer to campaign data shape above
  - Error code: 400 for invalid author or campaign

### DELETE - /api/:campaign/stats
  - Deletes an existing campaign, and all pledges for the campaign.
  - Query format: Campaign ID (number)
  - Error code: 400 for invalid author or campaign
