import React from 'react';
import AppBar from 'material-ui/AppBar';

export default React.createClass ({
  render () {
    return (
      <div>
        <AppBar title="Voting App" />
        {this.props.children}
      </div>
    );
  }
});
