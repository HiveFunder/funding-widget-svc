import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import BackButton from './BackButton';
import ProgressBar from './ProgressBar';

import style from '../style.css';

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
  render() {
    const { pledged, currCode, goal, endDate, backers, onClick } = this.props;

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
      timeLeft = Math.floor(moment(endDate * 1000).diff(moment(), 'hours', true)) || 0;
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
        <BackButton clickToBack={onClick} />
      </div>
    );
  }
}

StatsTrack.propTypes = {
  pledged: PropTypes.number.isRequired,
  currCode: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  endDate: PropTypes.number.isRequired,
  backers: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
