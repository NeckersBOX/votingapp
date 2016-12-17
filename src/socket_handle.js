import signup_handle from './socket_handles/signup';
import login_handle from './socket_handles/login';

export const emitObj = (socket, type, object, log = null) => {
  if ( log ) log (JSON.stringify (object));

  let db = null;
  if ( '$close_db' in object ) {
    db = object['$close_db'];
    delete object['$close_db'];
  }

  socket.emit (type, object);

  if ( db ) db.close ();

  return true;
};

const socket_handle = (io) => {
  io.on ('connection', (socket) => {
    /* TODO: check if request is from logged user */

    socket.on ('signup', (data) => signup_handle (socket, data));
    socket.on ('login', (data) => login_handle (socket, data));
  });
};

export default socket_handle;
