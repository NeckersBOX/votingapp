import { MongoClient } from 'mongodb';
import md5 from 'md5';
import { emitObj, authUser } from '../socket_handle';

const login_handle = (io, socket, data) => {
  authUser (data.$user, (err, result) => {
    if ( err )
      return emitObj (socket, 'login:res', { server_error: err }, console.warn);

    if ( result )
      return emitObj (socket, 'login:res', { error: 'User already logged.' });

    let username = data.name.toLowerCase ();

    MongoClient.connect (process.env.MONGOURI, (err, db) => {
      if ( err )
        return emitObj (socket, 'login:res', {
          server_error: 'MongoDB connect failed. Description: ' + err.message
        }, console.warn);

      let collection = db.collection ('vote_users');

      collection.findOne ({
        hash: md5 (username + ':' + data.pass)
      }, (err, doc) => {
        if (err)
          return emitObj (socket, 'login:res', {
            server_error: 'MongoDB findOne error. Description: ' + err.message,
            $close_db: db
          }, console.warn);

        if ( !doc )
          return emitObj (socket, 'login:res', {
            error: 'Username or password invalid.',
            $close_db: db
          });

        let currDate = new Date ().getTime ();
        let session_id = md5 (currDate + '$' + md5 (username + ':' + data.pass));

        collection.findOneAndUpdate ({ hash: doc.hash }, Object.assign ({}, doc, {
          session: session_id,
          time_login: Math.floor (currDate / 1000)
        }), (err, r) => {
          if (err)
            return emitObj (socket, 'login:res', {
              server_error: 'MongoDB findOneAndModify error. Description: ' + err.message,
              $close_db: db
            }, console.warn);

          emitObj (socket, 'login:res', { error: null,
            name: doc.name,
            session: session_id,
            $close_db: db
          });
        });
      });
    });
  });
};

export default login_handle;
