import React from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


const SignUpSummary = React.createClass ({
  getInitialState () {
    return { show_password: false };
  },
  render () {
    let button = (
      <RaisedButton primary={true} onClick={() => this.setState ({ show_password: true })}
        label="Show Password" />
    );

    return (
      <Paper style={{ padding: '8px' }}>
        <h1 className="text-center">Sign Up Completed!</h1>
        <p className="text-center">
          Now you can login with this credentials:
        </p>

        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Username</TableHeaderColumn>
              <TableHeaderColumn>Password</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>{this.props.name.text}</TableRowColumn>
              <TableRowColumn>
                {this.state.show_password ? this.props.password.text : button}
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  }
});

export default React.createClass ({
  getInitialState () {
    return {
      name: { text: '', valid: false, error: null },
      email: { text: '', valid: false, error: null },
      password: { text: '', valid: false, error: null },
      password_force: 0,
      password_confirm: { text: '', valid: false, error: null },
      button_disabled: true,
      registared: false
    };
  },
  render () {
    if ( this.state.registered )
      return <SignUpSummary {...this.state} />

    return (
      <Paper style={{ padding: '8px' }}>
        <h1 className="text-center">Sign Up</h1>

        <div className="align-center">
          <TextField hintText="Email" id="email" name="user_mail" type="text"
            value={this.state.email.text} errorText={this.state.email.error}
            onChange={this.changeMail} />
        </div>
        <div className="align-center">
          <TextField hintText="Username" id="username" name="user_name" type="text"
            value={this.state.name.text}  errorText={this.state.name.error}
            onChange={this.changeName} />
        </div>
        <div className="align-center">
          <TextField hintText="Password" id="password" name="user_pass" type="password"
            value={this.state.password.text} errorText={this.state.password.error}
            onChange={this.changePassword} />
        </div>
        <div className="align-center">
          <LinearProgress style={{ width: '256px', margin: 'auto', marginTop: '1em' }}
            mode="determinate" value={this.state.password_force} />
        </div>
        <div className="align-center">
          <TextField hintText="Confirm Password" id="password2" name="user_pass2" type="password"
            value={this.state.password_confirm.text} errorText={this.state.password_confirm.error}
            onChange={this.confirmPassword} />
        </div>
        <div className="align-center">
          <RaisedButton style={{ marginTop: '1em' }} primary={true} onClick={this.signUp}
            label="Sign up and start publish" disabled={this.state.button_disabled} />
        </div>
        <p className="text-center muted">
          <small>Your email and your password will be kept private.</small>
        </p>
      </Paper>
    );
  },
  changeMail (e) {
    let mail_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( mail_re.test (e.target.value) ) {
      let validate = this.state.name.valid && this.state.password.valid && this.state.password_confirm.valid;

      this.setState ({
        email: { text: e.target.value, valid: true, error: null },
        button_disabled: !validate
      });
      return;
    }

    this.setState ({
      email: {
        text: e.target.value,
        valid: false,
        error: 'Please insert a valid email address.'
      }
    });
  },
  changeName (e) {
    if ( e.target.value.trim ().length < 6 ) {
      this.setState ({
        name: {
          text: e.target.value,
          valid: false,
          error: 'Minimum length 6 characters'
        }
      });

      return;
    }

    let validate = this.state.email.valid && this.state.password.valid && this.state.password_confirm.valid;

    this.setState ({
      name: { text: e.target.value, valid: true, error: null },
      button_disabled: !validate
    });
  },
  changePassword (e) {
    try {
      if ( e.target.value.length < 8 ) {
        throw 'Minimum length 8 characters';
        return;
      }

      let validate = this.state.name.valid && this.state.email.valid && this.state.password_confirm.valid;

      this.setState ({
        password: { text: e.target.value, valid: true, error: null },
        button_disabled: !validate
      });
    }
    catch (err) {
      this.setState ({ password: { text: e.target.value, valid: false, error: err }});
    }

    this.changeForce (e.target.value);
  },
  confirmPassword (e) {
    if ( e.target.value != this.state.password.text ) {
      this.setState ({
        password_confirm: {
          text: e.target.value,
          valid: false,
          error: 'Invalid Password'
        }
      });

      return;
    }

    let validate = this.state.name.valid && this.state.email.valid && this.state.password.valid;

    this.setState ({
      password_confirm: { text: e.target.value, valid: true, error: null },
      button_disabled: !validate
    });
  },
  changeForce (password) {
    let force = 0;
    let variations = {
      digits: /\d/.test (password),
      lower: /[a-z]/.test (password),
      upper: /[A-Z]/.test (password),
      nonWords: /\W/.test (password)
    };

    let letters = new Object ();
    for ( let j = 0; j < password.length; j++ ) {
      letters[password[j]] = (letters[password[j]] || 0) + 1;
      force += 5.0 / letters[password[j]];
    }

    let variationCount = 0;
    for ( let check in variations )
      variationCount += (variations[check] == true) ? 1 : 0;
    force += (variationCount - 1) * 10;

    force = ( force > 100 ) ? 100 : Math.floor (force);
    this.setState ({ password_force: force });
  },
  signUp () {
    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'signup:req',
      data: Object.assign ({}, this.state, { $user: this.props.state.user })
    });

    this.props.state.io.on ('signup:res', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null ) {
        this.setState ({ registered: true });
      }
      else {
        this.setState ({
          [data.field]: {
            text: this.state[data.field].text,
            valid: false,
            error: data.error
          },
          button_disabled: true
        });
      }

      this.props.state.io.removeListener ('signup:res');
    });
  }
});
