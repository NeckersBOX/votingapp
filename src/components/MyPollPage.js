import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import NoAuth from './NoAuth';

export default React.createClass ({
  getInitialState () {
    return { loading: true, error: null, polls: [] };
  },
  componentDidMount () {
    if ( typeof this.props.state == 'undefined' || !this.props.state.user )
      return;

    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'my-polls:req',
      data: { $user: this.props.state.user }
    });

    this.props.state.io.on ('my-polls:res', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null ) {
        this.setState ({ loading: false, polls: data.polls });
      }
      else {
        this.setState ({ loading: false, error: data.error })
      }

      this.props.state.io.removeListener ('my-polls:res');
    });
  },
  componentDidUnmount () {
    this.props.state.io.removeListener ('my-polls:res');
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

    if ( this.state.error )
      return (
        <div>
          <h2 className="text-center">Oh no! An error occurred!</h2>
          <p className="text-center text-error">{this.state.error}</p>
        </div>
      );

    console.log (this.state.polls);
    return (
      <h1>My Polls</h1>
    );
  }
})
