import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';

import App from './components/App';

ReactDOM.hydrate((
  <BrowserRouter>
    <Route path="/:id" component={App} />
  </BrowserRouter>
), document.getElementById('funding-widget'));
