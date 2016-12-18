import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';

export default React.createClass ({
  render () {
    return (
      <Paper style={{ margin: '8px', padding: '8px' }}>
        <h3 className="text-center">You have to login to see this page.</h3>
        <p className="text-center">Not a user? <Link to="/signup">Sign up</Link></p>
      </Paper>
    );
  }
});
