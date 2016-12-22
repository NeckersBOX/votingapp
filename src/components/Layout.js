import React from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

const FlatResponsiveButton = React.createClass ({
  render () {
    let buttonStyle = {
      backgroundColor: 'transparent',
      color: 'white'
    };

    return (
      <div style={{ display: 'inline' }}>
        <div className="hide-sm">
          <FlatButton label={this.props.label} style={
            { backgroundColor: 'transparent', color: 'white' }
          } icon={this.props.icon} />
        </div>
        <div className="show-sm">
          <FlatButton style={
            { backgroundColor: 'transparent', color: 'white', minWidth: '48px' }
          } icon={this.props.icon} />
        </div>
      </div>
    );
  }
});

export default React.createClass ({
  getInitialState () {
    return { loading: true };
  },
  componentDidMount () {
    if ( this.props.state.io === null ) {
      let socket = io ();
      this.props.dispatch ({ type: 'SET_SOCKET_IO', data: socket });

      let localUser = localStorage.getItem ('__voteapp_session');
      if ( localUser !== null && this.props.state.user === null ) {
        let user = JSON.parse (localUser);

        this.props.dispatch ({
          type: 'EMIT_SOCKET_IO',
          api: 'auth:req',
          data: { $user: user }
        });

        socket.on ('auth:res', (data) => {
          if ( 'server_error' in data ) {
            console.warn (data.server_error);
          }
          else if ( data.error === null ) {
            this.props.dispatch ({
              type: 'SET_USER',
              data: user
            });
          }
          else console.warn (data.error);

          this.setState ({ loading: false });
          socket.removeListener ('auth:res');
        });
      }
      else this.setState ({ loading: false });
    }
  },
  render () {
    let AppBarMenu = null;
    if ( typeof this.props.state == 'undefined' || !this.props.state.user  ) {
      AppBarMenu = (
        <div className="appbar-btn">
          <Link to="/">
            <FlatResponsiveButton label="Home" icon={
              <FontIcon className="material-icons">home</FontIcon>
            } />
          </Link>
          <Link to="/signup">
            <FlatResponsiveButton label="Sign Up" icon={
              <FontIcon className="material-icons">person_add</FontIcon>
            } />
          </Link>
          <Link to="/login">
            <FlatResponsiveButton label="Login" icon={
              <FontIcon className="material-icons">account_circle</FontIcon>
            } />
          </Link>
        </div>
      );
    }
    else {
      AppBarMenu = (
        <div className="appbar-btn">
          <Link to="/">
            <FlatResponsiveButton label="Home" icon={
              <FontIcon className="material-icons">home</FontIcon>
            }/>
          </Link>
          <Link to="/add-poll">
            <FlatResponsiveButton label="New Poll" icon={
              <FontIcon className="material-icons">playlist_add</FontIcon>
            }/>
          </Link>
          <Link to="/my-poll">
            <FlatResponsiveButton label="My Polls" icon={
              <FontIcon className="material-icons">account_circle</FontIcon>
            }/>
          </Link>
          <Link to="/logout">
            <FlatResponsiveButton label="Logout" icon={
              <FontIcon className="material-icons">directions_run</FontIcon>
            } />
          </Link>
        </div>
      );
    }

    if ( this.state.loading )
      AppBarMenu = <CircularProgress color="#fff" style={{ marginTop: '8px' }} size={30} thickness={4} />;

    return (
      <div>
        <AppBar title="Vote!" showMenuIconButton={false} iconElementRight={AppBarMenu}>
        </AppBar>

        <div className="main">
          {this.props.children}
        </div>

        <div className="divider"></div>
        
        <p className="text-center muted text-small">
          Coded and Written by <a href="http://neckersbox.eu">Davide Francesco Merico</a>.
        </p>
        <p className="text-center muted text-small">
          <a href="https://github.com/NeckersBOX/votingapp">
            GitHub Project
          </a>
        </p>

      </div>
    );
  }
});
