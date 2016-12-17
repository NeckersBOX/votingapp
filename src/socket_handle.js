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
    socket.on ('signup', (data) => signup_handle (socket, data));
    socket.on ('login', (data) => login_handle (socket, data));
  });

  /* TODO: on disconnect can be handled? */
};

export default socket_handle;
