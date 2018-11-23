// Static methods for database interactions
class Models {
  // We may assume there is only one row to procure
  static getCampaignById(db, id) {
    return db.query('SELECT * FROM campaigns WHERE id = $1 LIMIT 1;', [id])
      .then((result) => result.rows[0])
      .catch((err) => { console.error(err); });
  }

  static getCampaignsByUser(db, username) {
    return db.query('SELECT * FROM campaigns WHERE _user = $1;', [username])
      .then((result) => result.rows)
      .catch((err) => { console.error(err); });
  }

  static addCampaign(db, data) {
    return db.query('INSERT INTO campaigns (campaign, description, author, _user, country, pledged, goal, backers, endDate, _type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);', Object.values(data))
      .then(() => ({ success: true }));
  }

  static pledgeCampaign(db, id, pledgeData) {
    return db.query('UPDATE campaigns SET pledged = pledged + $1, backers = backers + $2, WHERE id = $3;', [pledgeData.amount, pledgeData.newAmount, id])
      .catch((err) => { console.error(err); });
  }

  static updateCampaign(db, id, data) {
    return db.query('UPDATE campaigns SET campaign = $1, description = $2, author = $3, _user = $4, country = $5, pledged = $6, goal = $7, backers = $8, endDate = $9, _type = $10, WHERE id = $11;', [data.campaign, data.description, data.author, data.user, data.country, data.pledged, data.goal, data.backers, data.endDate, data._type, id])
      .catch((err) => { console.error(err); });
  }

  static deleteCampaign(db, id) {
    return db.query('DELETE FROM campaigns WHERE id = $1;', [id])
      .catch((err) => { console.error(err); });
  }
}

module.exports = Models;
