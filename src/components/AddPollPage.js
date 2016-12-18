import React from 'react';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';

import NoAuth from './NoAuth';

const QuestionStep = React.createClass ({
  componentDidMount () {
    setTimeout (() => this.props.completed ({ status: true, type: 'name', value: 'neckers' }), 3000);
  },
  render () {
    return (
      <p>Question Step</p>
    );
  }
});

const OptionsStep = React.createClass ({
  render () {
    return (
      <p>Options Step</p>
    );
  }
});

const PublishStep = React.createClass ({
  render () {
    return (
      <p>Publish Step</p>
    );
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
      }
    };
  },
  render () {
    if ( typeof this.props.state == 'undefined' || !this.props.state.user )
      return <NoAuth />;

    let stepContent = <p className="text-error">Invalid Step</p>;
    switch (this.state.step) {
      case 0:
        stepContent = <QuestionStep poll={this.state.poll} completed={this.stepCompleted} />;
        break;
      case 1:
        stepContent = <OptionsStep poll={this.state.poll} completed={this.stepCompleted} />;
        break;
      case 2:
        stepContent = <PublishStep poll={this.state.poll} />;
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
            <Step>
              <StepLabel>Publish</StepLabel>
            </Step>
          </Stepper>

          {stepContent}

          {(this.state.step > 0) ?
            <RaisedButton style={{ float: 'left' }} primary={true} label="Previous Step" onClick={
              () => this.setState ({ step: this.state.step - 1 })
            } /> : ''}

          {(this.state.step < 2) ?
            <RaisedButton style={{ float: 'right' }} primary={true} label="Next Step" onClick={
              () => this.setState ({ step: this.state.step + 1 })
            } disabled={!this.state.completed} /> :
            <RaisedButton style={{ float: 'right' }} primary={true} label="Publish" onClick={
              this.publishPoll
            } />}
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
    console.log (this.state.poll);
  }
});
