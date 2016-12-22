import React from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

const ShowOption = React.createClass ({
  render () {
    let percentage = (this.props.votes * 100) / (this.props.maxVotes ? this.props.maxVotes : 1);
    let voteButton = (
      <FlatButton style={{ display: 'inline-block' }} secondary={true}
        label={this.props.voted.option ? "It's for you" : "It's for me"}
        onClick={() => this.props.vote (this.props._id)} disabled={this.props.voted.option} />
    );

    if ( this.props.voted.poll && !this.props.voted.option )
      voteButton = '';

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

        {voteButton}
      </div>
    )
  }
});

const ShowPoll = React.createClass ({
  getInitialState () {
    let userVotes = localStorage.getItem ('__voteapp_votes');
    return { votes: userVotes ? JSON.parse (userVotes) : [] };
  },
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

        {this.props.poll.options
          .map ((val, id) => Object.assign ({}, val, { _id: id }))
          .sort ((opt_a, opt_b) => {
            if ( opt_a.votes == opt_b.votes )
              return (
                ( opt_a.name < opt_b.name ) ? -1 :
                ( opt_a.name > opt_b.name ) ? +1 : 0
              );

            return opt_b.votes - opt_a.votes;
          })
          .map ((val, id) => {
            let vote = {
              poll: false,
              option: false
            };

            for ( let j in this.state.votes ) {
              if ( this.state.votes[j].poll._id == this.props.poll._id
                && this.state.votes[j].poll.published_time == this.props.poll.published_time ) {
                vote.poll = true;
                if ( this.state.votes[j].option == val._id )
                  vote.option = true;
              }
            }

            return (
              <ShowOption {...val} vote={this.voteOpt} key={id} maxVotes={maxOptVotes} voted={vote} />
            );
          })}
      </div>
    );
  },
  voteOpt (option_id) {
    let votes = this.state.votes;
    votes.push ({
      poll: {
        published_time: this.props.poll.published_time,
        _id: this.props.poll._id
      },
      option: option_id
    });

    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'vote:req',
      data: {
        poll: this.props.poll._id,
        option: option_id
      }
    });

    this.props.state.io.on ('vote:res', (data) => {
      if ( 'server_error' in data )
        return console.warn (data.server_error);

      if ( data.error )
        return console.warn (data.error);

      this.setState ({ votes: votes });
      localStorage.setItem ('__voteapp_votes', JSON.stringify (votes));
    });
  }
});

export default React.createClass ({
  getInitialState () {
    return { loading: true, init: false, poll: null };
  },
  componentWillUnmount () {
    if ( typeof this.props.state == 'undefined' )
      return;

    this.props.state.io.removeListener ('poll:res');
  },
  render () {
    if ( typeof this.props.state == 'undefined' || !this.props.state.io )
      return (
        <div className="align-center">
          <CircularProgress style={{ marginTop: '8px' }} size={80} thickness={7} />
        </div>
      );

    if ( !this.state.init ) {
      this.setState ({ init: true });
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

        if ( data.poll._id == this.props.params.id )
          this.setState ({ loading: false, poll: data.poll });
      });
    }

    if ( this.state.loading )
      return (
        <div className="align-center">
          <CircularProgress style={{ marginTop: '8px' }} size={80} thickness={7} />
        </div>
      );

    if ( !this.state.poll )
      return (
        <Paper style={{ padding: '8px', margin: '8px' }}>
          <h1 className="text-center">Poll not found</h1>
        </Paper>
      );

    return <ShowPoll state={this.props.state} dispatch={this.props.dispatch} poll={this.state.poll} />
  }
});
