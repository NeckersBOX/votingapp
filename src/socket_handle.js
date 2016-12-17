import signup_handle from './socket_handles/signup';
import login_handle from './socket_handles/login';

export const emitObj = (socket, type, object, log = null) => {
  if ( log ) log (JSON.stringify (object));

  socket.emit (type, object);
  return true;
};

const socket_handle = (io) => {
  io.on ('connection', (socket) => {
    socket.on ('signup', (data) => signup_handle (socket, data));
    socket.on ('login', (data) => login_handle (socket, data));
  });
};

export default socket_handle;
