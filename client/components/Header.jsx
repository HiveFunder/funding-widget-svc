import React from 'react';
import PropTypes from 'prop-types';

import style from '../style.css';

const Header = ({ title, desc, author }) => (
  <div>
    <h2>{title}</h2>
    <p>{desc}</p>
    <p>{'By ' + author}</p>
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default Header;
