import React from 'react';
import { Link } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

import NoAuth from './NoAuth';

const MyPollsList = React.createClass ({
  render () {
    let listPollsItem = this.props.polls.map ((val, id) => {
      let date = new Date (val.published_time * 1000);
      let month = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ];

      let statsInfo = [
        date.getDate (), month[date.getMonth ()], date.getFullYear (),
        date.getHours () + ':' + date.getMinutes (), '- Votes:', val.votes
      ].join (' ');

      let rightIconMenu = (
        <IconMenu iconButtonElement={
          <IconButton touch={true} tooltip="Actions" tooltipPosition="bottom-left">
            <MoreVertIcon />
          </IconButton>
        }>
          <Link to={'/poll/' + val._id}>
            <MenuItem leftIcon={
              <FontIcon className="material-icons">open_in_new</FontIcon>
            }>Show</MenuItem>
          </Link>
          <MenuItem onClick={() => this.props.removePoll (val._id)} leftIcon={
            <FontIcon className="material-icons">delete</FontIcon>
          }>Remove</MenuItem>
        </IconMenu>
      );

      return (
        <ListItem key={id} style={{ textAlign: 'left' }} primaryText={val.question} disabled={true}
          secondaryText={statsInfo} rightIconButton={rightIconMenu} />
      );
    });

    if ( this.props.polls.length < 1 )
      return <h2 className="text-center">No Polls found.</h2>;

    return (
      <List>
        {listPollsItem}
      </List>
    );
  }
});

export default React.createClass ({
  getInitialState () {
    return { loading: true, error: null, polls: [] };
  },
  componentDidMount () {
    if ( typeof this.props.state == 'undefined' || !this.props.state.user )
      return;

    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'my-polls:req',
      data: { $user: this.props.state.user }
    });

    this.props.state.io.on ('my-polls:res', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null ) {
        this.setState ({ loading: false, polls: data.polls });
      }
      else {
        this.setState ({ loading: false, error: data.error })
      }

      this.props.state.io.removeListener ('my-polls:res');
    });
  },
  componentDidUnmount () {
    this.props.state.io.removeListener ('my-polls:res');
  },
  render () {
    if ( typeof this.props.state == 'undefined' || !this.props.state.user )
      return <NoAuth />;

    if ( this.state.loading )
      return (
        <div className="align-center">
          <CircularProgress size={80} thickness={7} />
        </div>
      );

    if ( this.state.error )
      return (
        <div>
          <h2 className="text-center">Oh no! An error occurred!</h2>
          <p className="text-center text-error">{this.state.error}</p>
        </div>
      );

    return (
      <div className="align-center">
        <h1>My Polls</h1>
        <Paper style={{ padding: '8px', margin: '8px' }}>
          <MyPollsList removePoll={this.removePoll} polls={this.state.polls} />
        </Paper>
      </div>
    );
  },
  removePoll (poll_id) {
    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'rm-poll:req',
      data: {
        poll_id: poll_id,
        $user: this.props.state.user
      }
    });

    this.props.state.io.on ('rm-poll:res', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null ) {
        let new_polls = this.state.polls;
        
        this.setState ({ polls: new_polls.filter ((val) => val._id != poll_id) });
      }
      else {
        console.warn (data.error);
      }

      this.props.state.io.removeListener ('rm-poll:res');
    });
  }
});
