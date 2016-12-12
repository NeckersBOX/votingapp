import React from 'react';

export default React.createClass ({
  render () {
    return (
      <div className="container-fluid">
        <h1 className="text-center">Voting App</h1>
        {this.props.children}
      </div>
    );
  }
});
