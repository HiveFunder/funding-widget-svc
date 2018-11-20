import React from 'react';
import PropTypes from 'prop-types';

import style from '../style.css';

const Header = ({ title, desc, author }) => (
  <div className={style.fundingHeader}>
    <p className={style.fundingHeaderName}>{'By ' + author}</p>
    <div className={style.fundingHeaderInfo}>
      <h2 className={style.campaign}>{title}</h2>
      <p>{desc}</p>
    </div>
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default Header;
