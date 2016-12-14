import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

export default React.createClass ({
  getInitialState () {
    return {
      name: '',
      email: '',
      password: '',
      password_force: 0,
      password_confirm: ''
    };
  },
  render () {
    return (
      <Paper style={{ padding: '8px' }}>
        <h1 className="text-center">Sign Up</h1>

        <div className="align-center">
          <TextField hintText="Email" id="email" name="user_mail" type="email"
            value={this.state.email} onChange={this.changeMail} />
        </div>
        <div className="align-center">
          <TextField hintText="Username" id="username" name="user_name" type="text"
            value={this.state.name} onChange={this.changeName} />
        </div>
        <div className="align-center">
          <TextField hintText="Password" id="password" name="user_pass" type="password"
            value={this.state.password} onChange={this.changePassword} />
        </div>
        <div className="align-center">
          <LinearProgress style={{ width: '256px', margin: 'auto' }} mode="determinate"
            value={this.state.password_force} />
        </div>
        <div className="align-center">
          <TextField hintText="Confirm Password" id="password2" name="user_pass2" type="password"
            value={this.state.password_confirm} onChange={this.confirmPassword} />
        </div>
        <div className="align-center">
          <RaisedButton primary={true} label="Sign up and start publish" onClick={this.signUp} />
        </div>
        <p className="text-center muted">
          <small>Your email and your password will be kept private.</small>
        </p>
      </Paper>
    );
  },
  changeMail (e) {
    /* TODO Validate */
    this.setState ({ email: e.target.value });
  },
  changeName (e) {
    this.setState ({ name: e.target.value });
  },
  changePassword (e) {
    /* TODO Check security */
    this.setState ({ password: e.target.value });
  },
  confirmPassword (e) {
    /* TODO Check if == */
    this.setState ({ password_confirm: e.target.value });
  },
  signUp () {
    console.log ('Sign Up!');
    console.log (this.state);
  }
});
