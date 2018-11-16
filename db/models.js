// Static methods for database interactions
class Models {
  static getCampaignById(db, id) {
    return db.query('SELECT * FROM campaigns WHERE id = ?', [id])
      .catch((err) => { console.error(err); });
  }

  static getCampaignsByAuthor(db, author) {
    return db.query('SELECT * FROM campaigns WHERE author = ?', [author])
      .catch((err) => { console.error(err); });
  }

  static addCampaign(db, data) {
    return db.query('INSERT INTO campaigns (campaign, description, author, currency, pledged, goal, backers, endDate, location, _type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', Object.values(data))
      .then(() => ({ success: true }));
  }

  static pledgeCampaign(db, id, pledgeData) {
    return db.query('UPDATE campaigns SET pledged = pledged + ?, backers = backers + ?, WHERE id = ?', [pledgeData.amount, pledgeData.newAmount, id])
      .catch((err) => { console.error(err); });
  }

  static updateCampaign(db, id, data) {
    return db.query('UPDATE campaigns SET campaign = ?, description = ?, author = ?, currency = ?, pledged = ?, goal = ?, backers = ?, endDate = ?, location = ?, _type = ?, WHERE id = ?', [data.campaign, data.description, data.author, data.currency, data.pledged, data.goal, data.backers, data.endDate, data.location, data._type, id])
      .catch((err) => { console.error(err); });
  }

  static deleteCampaign(db, id) {
    return db.query('DELETE FROM campaigns WHERE id = ?', [id])
      .catch((err) => { console.error(err); });
  }
}

module.exports = Models;

