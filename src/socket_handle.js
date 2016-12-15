const signup_handle = (socket, data) => {
  let mail_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  try {
    if ( mail_re.test (data.email.text) != true ) {
      throw { error: 'Please insert a valid email address.', field: 'email' };
      return;
    }

    if ( data.name.text.length < 6 ) {
      throw { error: 'Minimum length 6 characters.', field: 'name' };
      return;
    }

    /* TODO: check if email or name already exist */

    if ( data.password.text.length < 8 ) {
      throw { error: 'Minimum length 8 characters.', field: 'password' };
      return;
    }

    if ( data.password.text != data.password_confirm.text ) {
      throw { error: 'Invalid password', field: 'password_confirm' };
      return;
    }

    socket.emit ('signup', { error: null });
  }
  catch (res) {
    socket.emit ('signup', res);
  }
};

const socket_handle = (io) => {
  io.on ('connection', (socket) => {
    socket.on ('signup', (data) => signup_handle (socket, data));
  });
};

export default socket_handle;
