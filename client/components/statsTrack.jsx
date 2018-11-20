import React from 'react';
import moment from 'moment';
import BackButton from './BackButton';
import ProgressBar from './ProgressBar';
import style from '../style.css';

const HOST = 'http://localhost:3002';

// Lookup tables
// Accepted currency codes
const currCodes = ['USD', 'GBP', 'CAD', 'AUD', 'NZD', 'EUR', 'DKK', 'EUR',
  'NOK', 'SEK', 'CHF', 'EUR', 'EUR', 'EUR', 'EUR', 'EUR', 'EUR', 'EUR', 'EUR',
  'HKD', 'SGD', 'MXN', 'JPY'];

// the accepted countries of origin for campaigns
const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand',
  'Netherlands', 'Denmark', 'Ireland', 'Norway', 'Sweden', 'Germany',
  'France', 'Spain', 'Italy', 'Austria', 'Belgium', 'Switzerland', 'Luxembourg',
  'Hong Kong', 'Singapore', 'Mexico', 'Japan'];

const types = ['Art', 'Comics', 'Crafts', 'Dance', 'Design', 'Fashion', 'Film & Video',
  'Food', 'Games', 'Journalism', 'Music', 'Photography', 'Publishing', 'Technology', 'Theater'];

export default class StatsTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pledged: 0,
      goal: 0,
      backers: 0,
      deadline: '',
      currCode: 0,
    };
    this.loadCampaignStats = this.loadCampaignStats.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  componentDidMount() {
    this.loadCampaignStats();
  }

  loadCampaignStats() {
    const { campaignId } = this.props;

    // ask the server to retrieve campaign data from db
    fetch(`${HOST}/api/${campaignId}/stats`)
    .then(res => res.json())
    .then((stats) => { // update component state with db data
      this.setState({
        pledged: stats.pledged,
        goal: stats.goal,
        backers: stats.backers,
        endDate: stats.enddate,
        currCode: stats.country,
      });
    }).catch((err) => {
      throw err;
    });
  }

  clickHandler() { // increase pledged total and increment backer count
    const newPledge = 1 + Math.floor(Math.random() * 50);
    const { pledged, backers } = this.state;
    this.setState({
      pledged: (pledged + newPledge),
      backers: (backers + 1),
    });
  }

  render() {
    const { pledged, currCode, goal, endDate, backers } = this.state;

    // format funds as browser locale string with currency symbol/code
    const pledgeAmount = pledged.toLocaleString(undefined, { style: 'currency', currency: currCodes[currCode] });
    // format goal as browser locale string with currency symbol/code
    const goalAmount = goal.toLocaleString(undefined, { style: 'currency', currency: currCodes[currCode] });
    // render text string for amount raised
    const goalLine = `pledged of ${goalAmount} goal`;
    // format backers numbers according to browser locale
    const backerCount = backers.toLocaleString(undefined);
    // calculate remaining funding time
    let timeLeft = moment(endDate * 1000).diff(moment(), 'days') || 0;
    let timeUnits = 'days to go';

    if (timeLeft <= 0) { // reformat remaining time if less than one day
      timeLeft = moment(endDate * 1000).diff(moment(), 'hours', true) || 0;
      timeUnits = 'hours to go';
    }


    return (
      <div className={style.fundingTracker}>
        <ProgressBar fill={pledged} goal={goal} />
        <div className={style.pledgedAmount}>
          <h2>{pledgeAmount}</h2>
        </div>
        <div className={style.goalAmount}>
          <div>{goalLine}</div>
        </div>
        <div className={style.backerCount}>
          <h2>{backerCount}</h2>
          <div className={style.backers}>backers</div>
        </div>
        <div className={style.deadline}>
          <h2 className={style.remaining}>{timeLeft}</h2>
          <div className={style.units}>{timeUnits}</div>
        </div>
        <BackButton clickToBack={this.clickHandler} />
      </div>
    );
  }
}
