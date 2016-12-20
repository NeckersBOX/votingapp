import React from 'react';
import Paper from 'material-ui/Paper';

export default React.createClass ({
  getInitialState () {
    return { message: 'Logout..' };
  },
  componentDidMount () {
    if ( typeof this.props.state == 'undefined' || !this.props.state.user  )
      return;

    this.props.dispatch ({
      type: 'EMIT_SOCKET_IO',
      api: 'logout:req',
      data: { $user: this.props.state.user }
    });

    this.props.state.io.on ('logout:res', (data) => {
      if ( 'server_error' in data ) {
        console.warn (data.server_error);
      }
      else if ( data.error === null ) {
        localStorage.removeItem ('__voteapp_session');
        
        this.props.dispatch ({
          type: 'SET_USER',
          data: null
        });

        this.setState ({ message: 'Account disconnected! See you later!' });
      }
      else this.setState ({ message: data.error });

      this.props.state.io.removeListener ('logout:res');
    });
  },
  render () {
    return (
      <Paper style={{ padding: '8px', margin: '8px' }}>
        <h4 className="text-center">{this.state.message}</h4>
      </Paper>
    );
  }
});
