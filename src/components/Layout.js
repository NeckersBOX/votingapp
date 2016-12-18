import React from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';
import io from 'socket.io-client';

export default React.createClass ({
  componentDidMount () {
    if ( this.props.state.io === null ) {
      this.props.dispatch ({ type: 'SET_SOCKET_IO', data: io () });
    }
  },
  render () {
    let buttonStyle = {
      backgroundColor: 'transparent',
      color: 'white'
    };

    /* TODO: Add class hide-sm ( and hide-md, hide-lg? ) and show-* in the same way. */

    let AppBarMenu = null;
    if ( typeof this.props.state == 'undefined' || !this.props.state.user  ) {
      AppBarMenu = (
        <div className="appbar-btn">
          <Link to="/">
            <FlatButton label="Home" style={buttonStyle} icon={
              <FontIcon className="material-icons">home</FontIcon>
            }/>
          </Link>
          <Link to="/signup">
            <FlatButton label="Sign Up" style={buttonStyle} icon={
              <FontIcon className="material-icons">person_add</FontIcon>
            }/>
          </Link>
          <Link to="/login">
            <FlatButton label="Login" style={buttonStyle} icon={
              <FontIcon className="material-icons">account_circle</FontIcon>
            }/>
          </Link>
        </div>
      );
    }
    else {
      AppBarMenu = (
        <div className="appbar-btn">
          <Link to="/">
            <FlatButton label="Home" style={buttonStyle} icon={
              <FontIcon className="material-icons">home</FontIcon>
            }/>
          </Link>
          <FlatButton label="New Pull" style={buttonStyle} icon={
            <FontIcon className="material-icons">playlist_add</FontIcon>
          }/>
          <FlatButton label="My Pull" style={buttonStyle} icon={
            <FontIcon className="material-icons">account_circle</FontIcon>
          }/>
          <Link to="/logout">
            <FlatButton label="Logout" style={buttonStyle} icon={
              <FontIcon className="material-icons">directions_run</FontIcon>
            }/>
          </Link>
        </div>
      );
    }

    return (
      <div>
        <AppBar title="Vote!" showMenuIconButton={false} iconElementRight={AppBarMenu}>
        </AppBar>

        <div className="main">
          {this.props.children}
        </div>
      </div>
    );
  }
});
