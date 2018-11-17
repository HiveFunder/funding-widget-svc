import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';

import StatsTrack from './components/statsTrack';
import style from './style.css';

export default class App extends React.Component {
  render() {
    return (
      <div className={style.statstrack}>
        <StatsTrack campaignId={this.props.match.params.id} />
      </div>
    );
  }
}

ReactDOM.render((
  <BrowserRouter>
    <Route path="/:id" component={App} />
  </BrowserRouter>
), document.getElementById('funding-widget'));
