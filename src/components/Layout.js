import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';

export default React.createClass ({
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
            <FlatButton label="Login" style={buttonStyle} />
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
