import { MongoClient } from 'mongodb';
import md5 from 'md5';
import { emitObj } from '../socket_handle';

const login_handle = (socket, data) => {
  let username = data.name.toLowerCase ();

  if ( data['$user'] )
    return emitObj (socket, 'login', { error: 'User already logged.' });

  if ( typeof process.env.MONGOURI == 'undefined' )
    return emitObj (socket, 'login', {
      server_error: 'Environment variable MONGOURI not found'
    }, console.error);

  MongoClient.connect (process.env.MONGOURI, (err, db) => {
    if ( err )
      return emitObj (socket, 'login', {
        server_error: 'MongoDB connect failed. Description: ' + err.message
      }, console.warn);
      let collection = db.collection ('vote_users');

    collection.findOne ({
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

      let currDate = new Date ().getTime ();
      let session_id = md5 (currDate + '$' + md5 (username + ':' + data.pass));

      collection.findOneAndUpdate ({ hash: doc.hash }, Object.assign ({}, doc, {
        session: session_id,
        time_login: Math.floor (currDate / 1000)
      }), (err, r) => {
        if (err) {
          return emitObj (socket, 'login', {
            server_error: 'MongoDB findOneAndModify error. Description: ' + err.message,
            $close_db: db
          });
        }

        emitObj (socket, 'login', { error: null,
          name: doc.name,
          session: session_id,
          $close_db: db
        });
      });
    });
  });
};

export default login_handle;
