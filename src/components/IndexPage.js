import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';

export default React.createClass ({
  render () {
    return (
      <div>
        <Paper style={{ padding: '8px', marginBottom: '8px' }}>
          <h1 className="text-center">Voting App</h1>
          <h2 className="text-center">Create custom polls with live results.</h2>
          <Link to="/signup">
            <RaisedButton fullWidth={true} primary={true} label="Sign Up Now" />
          </Link>
        </Paper>

        <Tabs className="no-main">
          <Tab label="Trending" icon={<FontIcon className="material-icons">trending_up</FontIcon>}>
            <h3>Top trending Pulls</h3>
          </Tab>
          <Tab label="Popular" icon={<FontIcon className="material-icons">terrain</FontIcon>}>
            <h3>Popular Pulls</h3>
          </Tab>
          <Tab label="Latest" icon={<FontIcon className="material-icons">format_indent_increase</FontIcon>}>
            <h3>Latest Pulls</h3>
          </Tab>
        </Tabs>
      </div>
    );
  }
});
