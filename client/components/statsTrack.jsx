import React from 'react';
import Moment from 'moment';
import BackButton from './BackButton';
import ProgressBar from './ProgressBar';
import style from '../style.css';

class StatsTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pledged: 0,
      goal: 0,
      backers: 0,
      deadline: '',
      currCode: 'USD',
    };
    this.loadCampaignStats = this.loadCampaignStats.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  componentDidMount() {
    this.loadCampaignStats();
  }

  loadCampaignStats() {
    const currentUrl = window.location.href.split('/');
    const campaignId = currentUrl[currentUrl.length - 1];
    
    // ask the server to retrieve campaign data from db
    fetch(`http://localhost:3002/${campaignId}/stats`)
    .then(res => res.json())
    .then((stats) => { // update component state with db data
      this.setState({
        pledged: stats.pledged,
        goal: stats.goal,
        backers: stats.backers,
        deadline: stats.deadline,
        currCode: stats.currency,
      });
    }).catch((err) => {
      throw err;
    });
  }

  clickHandler() { // increase pledged total and increment backer count
    const newPledge = 1 + Math.floor(Math.random() * 50);
    const { pledged } = this.state;
    const { backers } = this.state;
    this.setState({
      pledged: (pledged + newPledge),
      backers: (backers + 1),
    });
  }

  render() {
    const { pledged } = this.state;
    const { currCode } = this.state;
    const { goal } = this.state;
    const { deadline } = this.state;
    const { backers } = this.state;

    // format funds as browser locale string with currency symbol/code
    const pledgeAmount = pledged.toLocaleString(undefined, { style: 'currency', currency: currCode });
    // format goal as browser locale string with currency symbol/code
    const goalAmount = goal.toLocaleString(undefined, { style: 'currency', currency: currCode });
    // render text string for amount raised
    const goalLine = `pledged of ${goalAmount} goal`;
    // format backers numbers according to browser locale
    const backerCount = backers.toLocaleString(undefined);
    // calculate remaining funding time
    let timeLeft = Moment(deadline).diff(Moment(), 'days') || 0;
    let timeUnits = 'days to go';

    if (timeLeft <= 0) { // reformat remaining time if less than one day
      timeLeft = Moment(deadline).diff(Moment(), 'hours', true) || 0;
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

export default StatsTrack;
