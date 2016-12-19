import React from 'react';
import { Link } from 'react-router';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import NoAuth from './NoAuth';

const QuestionStep = React.createClass ({
  getInitialState () {
    return { name: this.props.poll.name };
  },
  componentDidMount () {
    this.props.completed ({
      status: (this.state.name.length > 5) ? true : false,
      type: 'name',
      value: this.state.name
    });
  },
  render () {
    return (
      <div>
        <p>Chose a name for the poll</p>
        <TextField hintText="Ex. What's your age?" id="poll_name" name="poll_name" type="text"
          value={this.state.name} onChange={this.changeName} />
        <p className="text-small muted">Minimum 6 characters</p>
      </div>
    );
  },
  changeName (e) {
    this.props.completed ({
      status: (e.target.value.trim ().length > 5) ? true : false,
      type: 'name',
      value: e.target.value.trim ()
    });

    this.setState ({ name: e.target.value });
  }
});

const AddOption = React.createClass ({
  getInitialState () {
    return { option: '' };
  },
  render () {
    return (
      <div>
        <TextField hintText="Ex. 20 years old" id="poll_option" name="poll_option" type="text"
          value={this.state.option} onChange={(e) => this.setState ({ option: e.target.value })} />
        <RaisedButton secondary={true} label="Add Option" onClick={this.sendOption}
          disabled={!this.state.option.trim ().length} />
      </div>
    );
  },
  sendOption () {
    this.setState ({ option: '' });
    this.props.callback (this.state.option)
  }
});

const OptionsStep = React.createClass ({
  getInitialState () {
    return { options: this.props.poll.options };
  },
  componentDidMount () {
    this.props.completed ({
      status: (this.state.options.length > 1) ? true : false,
      type: 'options',
      value: this.state.options
    });
  },
  render () {
    let optionsList = '';
    if ( this.state.options.length ) {
      let optionsListItem = this.state.options.map ((val, id) => (
        <ListItem key={id} style={{ textAlign: 'left' }} primaryText={val} disabled={true}
          rightIconButton={
            <IconButton onClick={() => this.removeOption (id)} tooltip="Remove Option">
              <FontIcon className="material-icons">delete</FontIcon>
            </IconButton>
          } />
      ));

      optionsList = (
        <Paper style={{ padding: '8px', margin: '8px' }}>
          <List>
            <Subheader style={{ textAlign: 'left' }}>{this.props.poll.name}</Subheader>
            {optionsListItem}
          </List>
        </Paper>
      );
    }

    return (
      <div>
        <p>Insert at least two options</p>

        {optionsList}

        <AddOption callback={this.addOption} />
      </div>
    );
  },
  addOption (value) {
    let new_options = this.state.options;
    new_options.push (value);

    this.props.completed ({
      status: (new_options.length > 1) ? true : false,
      type: 'options',
      value: new_options
    });

    this.setState ({ options: new_options });
  },
  removeOption (id) {
    let new_options = this.state.options;
    new_options = new_options.filter ((val, idx) => (idx != id));

    this.props.completed ({
      status: (new_options.length > 1) ? true : false,
      type: 'options',
      value: new_options
    });

    this.setState ({ options: new_options });
  }
});

export default React.createClass ({
  getInitialState () {
    return {
      completed: false,
      step: 0,
      poll: {
        name: '',
        options: []
      },
      published: null,
      loading: false
    };
  },
  render () {
    if ( typeof this.props.state == 'undefined' || !this.props.state.user )
      return <NoAuth />;

    if ( this.state.loading )
      return (
        <div className="align-center">
          <CircularProgress size={80} thickness={7} />
        </div>
      );

    if ( this.state.published )
      return <div className="align-center">{this.state.published}</div>;

    let stepContent = <p className="text-error">Invalid Step</p>;
    switch (this.state.step) {
      case 0:
        stepContent = <QuestionStep poll={this.state.poll} completed={this.stepCompleted} />;
        break;
      case 1:
        stepContent = <OptionsStep poll={this.state.poll} completed={this.stepCompleted} />;
        break;
    }

    return (
      <div>
        <h1 className="text-center">Add a new poll</h1>

        <div className="align-center">
          <Stepper activeStep={this.state.step}>
            <Step>
              <StepLabel>Question</StepLabel>
            </Step>
            <Step>
              <StepLabel>Options</StepLabel>
            </Step>
          </Stepper>

          {stepContent}

          {(this.state.step > 0) ?
            <RaisedButton style={{ float: 'left' }} primary={true} label="Previous Step" onClick={
              () => this.setState ({ step: this.state.step - 1 })
            } /> : ''}

          {(this.state.step < 1) ?
            <RaisedButton style={{ float: 'right' }} primary={true} label="Next Step" onClick={
              () => this.setState ({ step: this.state.step + 1 })
            } disabled={!this.state.completed} /> :
            <RaisedButton style={{ float: 'right' }} primary={true} label="Publish"
              onClick={this.publishPoll} disabled={!this.state.completed} />}
        </div>
      </div>
    );
  },
  stepCompleted (data) {
    this.setState ({
      completed: data.status,
      poll: Object.assign ({}, this.state.poll, { [data.type]: data.value })
    });
  },
  publishPoll () {
    this.setState ({ loading: true });

    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'add-poll:req',
      data: Object.assign ({}, this.state.poll, {
        $user: this.props.state.user
      })
    });

    this.props.state.io.on ('add-poll:res', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null ) {
        this.setState ({
          loading: false,
          published: (
            <div className="align-center">
              <h2 className="text-center">Hoo-ray! Poll published!</h2>
              <Link to={data.url}>
                <RaisedButton primary={true} label="Show this poll" />
              </Link>
            </div>
          )
        });
      }
      else {
        this.setState ({
          loading: false,
          published: (
            <div>
              <h2 className="text-center">Error while publish the poll</h2>
              <p className="text-center">{data.error}</p>
            </div>
          )
        });
      }

      this.props.state.io.removeListener ('add-poll:res');
    });
  }
});
