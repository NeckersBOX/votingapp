import { emitObj, authUser } from '../socket_handle';

const auth_handle = (io, socket, data) => {
  authUser (data.$user, (err, result) => {
    if ( err )
      return emitObj (socket, 'auth:res', { server_error: err }, console.warn);

    if ( !result )
      return emitObj (socket, 'auth:res', { error: 'Unauthorized user.' });

    return emitObj (socket, 'auth:res', { error: null });
  });
};

export default auth_handle;
