import { MongoClient } from 'mongodb';

import signup_handle from './socket_handles/signup';
import login_handle from './socket_handles/login';
import logout_handle from './socket_handles/logout';
import addpoll_handle from './socket_handles/addpoll';
import mypolls_handle from './socket_handles/mypolls';
import auth_handle from './socket_handles/auth';
import rmpoll_handle from './socket_handles/rmpoll';
import popular_handle from './socket_handles/popular';
import latest_handle from './socket_handles/latest';
import poll_handle from './socket_handles/poll';
import vote_handle from './socket_handles/vote';
import addopt_handle from './socket_handles/addopt';

const socket_handle = (io) => {
  io.on ('connection', (socket) => {
    socket.on ('signup:req',   (data) => signup_handle  (io, socket, data));
    socket.on ('login:req',    (data) => login_handle   (io, socket, data));
    socket.on ('auth:req',     (data) => auth_handle    (io, socket, data));
    socket.on ('logout:req',   (data) => logout_handle  (io, socket, data));
    socket.on ('poll:req',     (data) => poll_handle    (io, socket, data));
    socket.on ('vote:req',     (data) => vote_handle    (io, socket, data));
    socket.on ('add-opt:req',  (data) => addopt_handle  (io, socket, data));
    socket.on ('add-poll:req', (data) => addpoll_handle (io, socket, data));
    socket.on ('rm-poll:req',  (data) => rmpoll_handle  (io, socket, data));
    socket.on ('my-polls:req', (data) => mypolls_handle (io, socket, data));
    socket.on ('popular:req',  (data) => popular_handle (io, socket, data));
    socket.on ('latest:req',   (data) => latest_handle  (io, socket, data));
  });
};

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

export const authUser = (user_info, callback) => {
  if ( !user_info )
    return callback (null, false);

  if ( typeof process.env.MONGOURI == 'undefined' )
    return callback ('Environment variable MONGOURI not found', false);

  MongoClient.connect (process.env.MONGOURI, (err, db) => {
    if (err)
      return callback ('MongoDB connect failed. Description: ' + err.message, false);

    db.collection ('vote_users').findOne ({ session: user_info.session }, (err, doc) => {
      db.close ();

      if (err)
        return callback ('MongoDB findOne failed. Description: ' + err.message, false);

      return callback (null, doc ? true : false);
    });
  });
};

export default socket_handle;
