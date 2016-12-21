import React from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

const ShowOption = React.createClass ({
  getInitialState () {
    return { voted: false };
  },
  render () {
    let percentage = this.props.votes * 100 / (this.props.maxVote ? this.props.maxVote : 1);

    return (
      <div>
        <h3 style={{ color: 'rgba(0,0,0,0.89)'}}>{this.props.name}</h3>
        <div style={{
          height: '30px',
          width: '100%',
          background: 'linear-gradient(to right, #2196F3 ' + percentage + '%, #E0E0E0 ' + percentage + '%'
        }}>
        </div>
        <h3 style={{ display: 'inline-block' }} className="muted">
          {this.props.votes} Vote{this.props.votes == 1 ? '' : 's'}
        </h3>
        <FlatButton style={{ display: 'inline-block' }} label={this.state.voted ?
          "It's for you" : "It's for me"}
          secondary={true} onClick={this.voteOption} disabled={this.state.voted} />
      </div>
    )
  },
  voteOption () {
    this.setState ({ voted: true });
  }
});

const ShowPoll = React.createClass ({
  render () {
    let maxOptVotes = this.props.poll.options.reduce ((prev, curr) => Math.max (curr.votes, prev), 0);
    let date = new Date (this.props.poll.published_time * 1000);
    let month = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];

    let statsInfo = [
      date.getDate (), month[date.getMonth ()], date.getFullYear (),
      date.getHours () + ':' + date.getMinutes ()
    ].join (' ');

    return (
      <div>
        <Paper style={{ padding: '8px', margin: '8px' }}>
          <h1 className="text-center">{this.props.poll.question}</h1>
          <p className="text-center muted text-small">
            {this.props.poll.author}, {statsInfo}
          </p>
        </Paper>

        {this.props.poll.options.sort ((opt_a, opt_b) => {
          if ( opt_a.votes == opt_b.votes )
            return (
              ( opt_a.name < opt_b.name ) ? -1 :
              ( opt_a.name > opt_b.name ) ? +1 : 0
            );

          return opt_b.votes - opt_a.votes;
        }).map ((val, id) => <ShowOption {...val} key={id} maxVotes={maxOptVotes} />)}
      </div>
    );
  }
});

export default React.createClass ({
  getInitialState () {
    return { loading: true, poll: null };
  },
  componentDidMount () {
    if ( typeof this.props.state == 'undefined' )
      return;

    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'poll:req',
      data: { poll_id: this.props.params.id }
    });

    this.props.state.io.on ('poll:res', (data) => {
      if ( 'server_error' in data )
        return console.warn (data.server_error);

      if ( data.error )
        return console.warn (data.error);

      this.setState ({ loading: false, poll: data.poll });
    });
  },
  componentDidUnmount () {
    if ( typeof this.props.state == 'undefined' )
      return;

    this.props.state.io.removeListener ('poll:res');
  },
  render () {
    if ( this.state.loading )
      return (
        <div className="align-center">
          <CircularProgress size={80} thickness={7} />
        </div>
      );

    if ( !this.state.poll )
      return (
        <Paper style={{ padding: '8px', margin: '8px' }}>
          <h1 className="text-center">Poll not found</h1>
        </Paper>
      );

    return <ShowPoll poll={this.state.poll} />
  }
});
