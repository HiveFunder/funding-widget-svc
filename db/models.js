// Static methods for database interactions
class Models {
  static getCampaignById(db, id) {
    return db.query('SELECT * FROM campaigns WHERE id = $1;', [id])
      .then((result) => result.rows[0])
      .catch((err) => { console.error(err); });
  }

  static getCampaignsByAuthor(db, username) {
    return db.query('SELECT * FROM campaigns WHERE author = $1;', [username])
      .catch((err) => { console.error(err); });
  }

  static addCampaign(db, data) {
    return db.query('INSERT INTO campaigns (campaign, description, author, currency, pledged, goal, backers, endDate, location, _type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);', Object.values(data))
      .then(() => ({ success: true }));
  }

  static pledgeCampaign(db, id, pledgeData) {
    return db.query('UPDATE campaigns SET pledged = pledged + $1, backers = backers + $2, WHERE id = $3;', [pledgeData.amount, pledgeData.newAmount, id])
      .catch((err) => { console.error(err); });
  }

  static updateCampaign(db, id, data) {
    return db.query('UPDATE campaigns SET campaign = $1, description = $2, author = $3, currency = $4, pledged = $5, goal = $6, backers = $7, endDate = $8, location = $9, _type = $10, WHERE id = $11;', [data.campaign, data.description, data.username, data.currency, data.pledged, data.goal, data.backers, data.endDate, data.location, data._type, id])
      .catch((err) => { console.error(err); });
  }

  static deleteCampaign(db, id) {
    return db.query('DELETE FROM campaigns WHERE id = $1;', [id])
      .catch((err) => { console.error(err); });
  }
}

module.exports = Models;

