import React from 'react';
import { Link } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';

const PollsList = React.createClass ({
  render () {
    let pollsItem = this.props.polls.map ((val, id) => {
      let date = new Date (val.published_time * 1000);
      let month = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ];

      let statsInfo = [
        date.getDate (), month[date.getMonth ()], date.getFullYear (),
        date.getHours () + ':' + date.getMinutes ()
      ].join (' ');

      return (
        <Link to={'/poll/' + val._id} key={id}>
          <ListItem primaryText={val.question}
            secondaryText={<p>{val.author}, {statsInfo} - <b>{val.votes} Votes</b></p>} />
        </Link>
      );
    });

    return <List>{pollsItem}</List>;
  }
});

const PollsTabContent = React.createClass ({
  getInitialState () {
    return { loading: true, polls: [] };
  },
  componentDidMount () {
    if ( typeof this.props.state == 'undefined' )
      return;

    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: this.props.type + ':req',
      data: { skip: 0, limit: 10 }
    });

    this.props.state.io.on (this.props.type + ':res', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error == null ) {
        this.setState ({ loading: false, polls: data.polls });
      }
      else {
        console.warn (data.error);
      }

      this.props.state.io.removeListener (this.props.type + ':res');
    });
  },
  render () {
    if ( this.state.loading )
      return (
        <div className="align-center">
          <CircularProgress size={80} thickness={7} />
        </div>
      );

    return (
      <div className="align-center">
        <PollsList polls={this.state.polls} />
      </div>
    );
  }
});

export default React.createClass ({
  render () {
    return (
      <div>
        <Paper style={{ padding: '8px', marginBottom: '8px' }}>
          <h1 className="text-center">Voting App</h1>
          <h2 className="text-center">Create custom polls with live results.</h2>
          { ( typeof this.props.state == 'undefined' || !this.props.state.user ) ? (
            <Link to="/signup">
              <RaisedButton fullWidth={true} primary={true} label="Sign Up Now" />
            </Link> ) : ''
          }
        </Paper>

        <Tabs className="no-main">
          <Tab label="Popular" icon={<FontIcon className="material-icons">terrain</FontIcon>}>
            <PollsTabContent type='popular' {...this.props} />
          </Tab>
          <Tab label="Latest" icon={<FontIcon className="material-icons">format_indent_increase</FontIcon>}>
            <PollsTabContent type='latest' {...this.props} />
          </Tab>
        </Tabs>
      </div>
    );
  }
});
