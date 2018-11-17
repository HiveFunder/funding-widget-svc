import React from 'react';
import PropTypes from 'prop-types';
import style from '../style.css';

const BackButton = ({ clickToBack }) => (
  <button type="button" className={style.backingButton} onClick={clickToBack}>Back this Campaign</button>
);

BackButton.propTypes = {
  clickToBack: PropTypes.func.isRequired,
};

export default BackButton;
