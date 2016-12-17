import { MongoClient } from 'mongodb';
import md5 from 'md5';
import { emitObj } from '../socket_handle';

const login_handle = (socket, data) => {
  let username = data.name.toLowerCase ();

  if ( typeof process.env.MONGOURI == 'undefined' )
    return emitObj (socket, 'login', {
      server_error: 'Environment variable MONGOURI not found'
    }, console.error);

    MongoClient.connect (process.env.MONGOURI, (err, db) => {
      if ( err )
        return emitObj (socket, 'login', {
          server_error: 'MongoDB connect failed. Description: ' + err.message
        }, console.warn)

      db.collection ('vote_users').findOne ({
        hash: md5 (username + ':' + data.pass)
      }, (err, doc) => {
        if (err)
          return emitObj (socket, 'login', {
            server_error: 'MongoDB findOne error. Description: ' + err.message,
            $close_db: db
          }, console.warn);

        if ( !doc )
          return emitObj (socket, 'login', {
            error: 'Username or password invalid.',
            $close_db: db
          });

        /* TODO: init session / update login\logged in database ( findOne -> findAndModify? ) */

        emitObj (socket, 'login', { error: null, $close_db: db });
      });
    });
};

export default login_handle;
