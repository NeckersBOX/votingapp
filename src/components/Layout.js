import React from 'react';
import AppBar from 'material-ui/AppBar';
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
            <FlatButton label="Home" style={buttonStyle} />
          </Link>
          <Link to="/signup">
            <FlatButton label="Sign Up" style={buttonStyle} />
          </Link>
          <Link to="/login">
            <FlatButton label="Login" style={buttonStyle} />
          </Link>
        </div>
      );
    }
    else {
      AppBarMenu = (
        <div className="appbar-btn">
          <Link to="/">
            <FlatButton label="Home" style={buttonStyle} />
          </Link>
          <FlatButton label="New Pull" style={buttonStyle} />
          <FlatButton label="My Pull" style={buttonStyle} />
          <Link to="/logout">
            <FlatButton label="Logout" style={buttonStyle} />
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
