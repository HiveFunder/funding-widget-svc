import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';

import Header from './components/Header';
import StatsTrack from './components/statsTrack';
import style from './style.css';

const HOST = 'http://ec2-18-144-52-79.us-west-1.compute.amazonaws.com';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pledged: 0,
      goal: 0,
      backers: 0,
      endDate: Math.floor((new Date().getTime() + 1000) / 1000),
      currCode: 0,
      title: 'Star Citizen',
      desc: 'Best vaporware ever!',
      author: 'Chris Roberts'
    };
    this.loadCampaignStats = this.loadCampaignStats.bind(this);
    this.clickHandler = this.clickHandler.bind(this);    
  }

  componentDidMount() {
    this.loadCampaignStats();
  }

  loadCampaignStats() {
    const { match } = this.props;

    // ask the server to retrieve campaign data from db
    fetch(`${HOST}/api/${match.params.id}/stats`)
    .then(res => res.json())
    .then((stats) => { // update component state with db data
      this.setState({
        pledged: stats.pledged,
        goal: stats.goal,
        backers: stats.backers,
        endDate: stats.enddate,
        currCode: stats.country,
        title: stats.campaign,
        desc: stats.description,
        author: stats.author
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
    const { pledged, currCode, goal, endDate, backers, title, desc, author } = this.state;

    return (
      <div className={style.statsGrid}>
        <Header 
          title={title}
          desc={desc}
          author={author}
        />
        <StatsTrack  
          pledged={pledged}
          currCode={currCode}
          goal={goal}
          endDate={endDate}
          backers={backers}
          onClick={this.clickHandler}
        />
      </div>
    );
  }
}

ReactDOM.render((
  <BrowserRouter>
    <Route path="/:id" component={App} />
  </BrowserRouter>
), document.getElementById('funding-widget'));
