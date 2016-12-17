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

    return (
      <div>
        <AppBar title="Vote!" showMenuIconButton={false} iconElementRight={
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
        }>
        </AppBar>

        <div className="main">
          {this.props.children}
        </div>
      </div>
    );
  }
});
