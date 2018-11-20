import React from 'react';
import PropTypes from 'prop-types';
import style from '../style.css';

const ProgressBar = ({ goal, fill }) => (
  <progress max="1" value={(fill / goal).toString()} className={style.progressBar} />
);

ProgressBar.propTypes = {
  goal: PropTypes.number.isRequired,
  fill: PropTypes.number.isRequired,
};

export default ProgressBar;
