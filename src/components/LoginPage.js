import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default React.createClass ({
  getInitialState () {
    return { name: '', pass: '' };
  },
  render () {
    return (
      <Paper style={{ margin: '8px', padding: '8px' }}>
        <h1 className="text-center">Login</h1>
        <p className="text-center">
          Not register yet?
          <Link to='/signup'>
            Sign Up
          </Link>
        </p>

        <div className="align-center">
          <TextField hintText="Username" id="username" name="username" type="text"
            value={this.state.name} onChange={(e) => this.handleChange ('name', e)} />
        </div>
        <div className="align-center">
          <TextField hintText="Password" id="password" name="password" type="password"
            value={this.state.pass} onChange={(e) => this.handleChange ('pass', e)} />
        </div>
        <div className="align-center">
          <RaisedButton primary={true} onClick={this.login} label="Login" />
        </div>
      </Paper>
    );
  },
  handleChange (type, e) {
    this.setState ({ [type]: e.target.value });
  },
  login () {
    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'login',
      data: this.state
    });

    this.props.state.io.on ('login', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null ) {
        console.log ('Login!');
      }
      else {
        console.log (data.error);
      }

      this.props.state.io.removeListener ('login');
    });
  }
});
