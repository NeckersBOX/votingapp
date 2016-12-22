import React from 'react';
import { Chart } from 'react-google-charts';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';

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

const ShowChart = React.createClass ({
  getInitialState () {
    return { resize: 0 };
  },
  componentDidMount () {
    window.addEventListener ('resize', this.toggleState);
  },
  componentWillUnmount () {
    window.removeEventListener ('resize', this.toggleState);
  },
  render () {
    if ( !this.props.maxVotes )
      return <span></span>;

    return (
      <Chart chartType="PieChart" options={{ legend: 'none' }} graph_id={"PollPieChart" + this.state.resize}
        width="100%" height="400px" data={this.props.data} legend_toggle />
    );
  },
  toggleState () {
    this.setState ({ resize: 1 - this.state.resize });
  }
});

const ShareButtons = React.createClass ({
  getInitialState () {
    return { auth: false };
  },
  componentDidMount () {
    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'auth:req',
      data: { $user: this.props.state.user }
    });

    this.props.state.io.on ('auth:res', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null
        && this.props.poll.author == this.props.state.user.name ) {
        this.setState ({ auth: true });
      }

      this.props.state.io.removeListener ('auth:res');
    });
  },
  render () {
    if ( !this.state.auth )
      return <span></span>;

    let poll_url = 'https://neckers-voteapp.herokuapp.com/poll/' + this.props.poll._id;
    console.log (this.props);
    return (
      <div className="align-center">
        <a href={"https://www.facebook.com/sharer/sharer.php?u=" + poll_url}>
          <RaisedButton label="facebook" secondary={true}
            icon={<FontIcon className="material-icons">share</FontIcon>} />
        </a>
        <a href={"https://twitter.com/home?status=Tell%20us%20your%20opinion!%20-%20" + poll_url}>
          <RaisedButton label="twitter" secondary={true}
            icon={<FontIcon className="material-icons">share</FontIcon>}
            style={{ marginLeft: '5px' }}/>
        </a>
        <a href={"https://www.linkedin.com/shareArticle?mini=true&url=" + poll_url
          + "&title=" + this.props.poll.question}>
          <RaisedButton label="linkedin" secondary={true}
            style={{ marginLeft: '5px' }} icon={<FontIcon className="material-icons">share</FontIcon>}/>
        </a>
      </div>
    );
  }
});

const AddOptionForm = React.createClass ({
  getInitialState () {
    return { auth: false, option: '', loading: false };
  },
  componentDidMount () {
    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'auth:req',
      data: { $user: this.props.state.user }
    });

    this.props.state.io.on ('auth:res', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null ) {
        this.setState ({ auth: true });
      }

      this.props.state.io.removeListener ('auth:res');
    });
  },
  componentWillUnmount () {
    this.props.state.io.removeListener ('auth:res');
  },
  render () {
    if ( !this.state.auth )
      return <span></span>;

    return (
      <div className="align-center">
        <h2>Not enough options? Add another one!</h2>
        <TextField hintText="Ex. I love potato" id="poll_option" name="poll_option" type="text"
          value={this.state.option} onChange={(e) => this.setState ({ option: e.target.value })} />

        <RaisedButton secondary={true} label="Add Option" onClick={this.sendOption}
          disabled={!this.state.option.trim ().length || this.loading} />
      </div>
    );
  },
  sendOption () {
    this.setState ({ loading: true });

    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'add-opt:req',
      data: {
        poll: this.props.poll,
        option: this.state.option,
        $user: this.props.state.user
      }
    });

    this.props.state.io.on ('add-opt:res', (data) => {
      if ( 'server_error' in data )
        return console.warn (data.server_error);

      if ( data.error )
        return console.warn (data.error);

      this.setState ({ loading: false, option: '' });
      this.props.state.io.removeListener ('add-opt:res');
    })
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

    let pollOptions = this.props.poll.options
      .map ((val, id) => Object.assign ({}, val, { _id: id }))
      .sort ((opt_a, opt_b) => {
        if ( opt_a.votes == opt_b.votes )
          return (
            ( opt_a.name < opt_b.name ) ? -1 :
            ( opt_a.name > opt_b.name ) ? +1 : 0
          );

        return opt_b.votes - opt_a.votes;
      });

    return (
      <div>
        <Paper style={{ padding: '8px', margin: '8px' }}>
          <h1 className="text-center">{this.props.poll.question}</h1>
          <p className="text-center muted text-small">
            {this.props.poll.author}, {statsInfo}
          </p>
          <ShareButtons {...this.props} />
        </Paper>

        <ShowChart maxVotes={maxOptVotes} data={[
          ['Option', 'Votes']
        ].concat (pollOptions.map ((val) => [ val.name, val.votes ]))} />

        {pollOptions.map ((val, id) => {
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

        <AddOptionForm {...this.props} />
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
