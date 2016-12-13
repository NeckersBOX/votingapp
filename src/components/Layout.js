import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

export default React.createClass ({
  render () {
    let buttonStyle = {
      backgroundColor: 'transparent',
      color: 'white'
    };

    return (
      <div>
        <AppBar title="Voting App" showMenuIconButton={false} iconElementRight={
          <div className="appbar-btn">
            <FlatButton label="Sign Up" style={buttonStyle} />
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
