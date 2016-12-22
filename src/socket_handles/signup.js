import { MongoClient } from 'mongodb';
import md5 from 'md5';
import { emitObj, authUser } from '../socket_handle';

const signup_handle = (io, socket, data) => {
  authUser (data.$user, (err, result) => {
    if ( err )
      return emitObj (socket, 'signup:res', { server_error: err }, console.warn);

    if ( result )
      return emitObj (socket, 'signup:res', { error: 'User already logged.' });

    let username = data.name.text.toLowerCase ();
    let mail_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    MongoClient.connect (process.env.MONGOURI, (err, db) => {
      if ( err )
        return emitObj (socket, 'signup:res', {
          server_error: 'MongoDB connect failed. Description: ' + err.message
        }, console.warn)

      let collection = db.collection ('vote_users');

      if ( mail_re.test (data.email.text) != true )
        return emitObj (socket, 'signup:res', {
          error: 'Please insert a valid email address', field: 'email',
          $close_db: db
        });

      if ( data.name.text.trim ().length < 6 )
        return emitObj (socket, 'signup:res', {
          error: 'Minimum length 6 characters.', field: 'name',
          $close_db: db
        });

      collection.findOne ({
        $or: [ { name: username }, { email: data.email.text.toLowerCase () } ]
      }, (err, doc) => {
        if (err)
          return emitObj (socket, 'signup:res', {
            server_error: 'MongoDB findOne error. Description: ' + err.message,
            $close_db: db
          }, console.warn);

        if ( doc ) {
          if ( doc.name == username )
            emitObj (socket, 'signup:res', {
              error: 'Sorry, this username already exists.', field: 'name',
              $close_db: db
            });
          else
            emitObj (socket, 'signup:res', {
              error: 'Sorry, already exists an account with this email.', field: 'email',
              $close_db: db
            });
        }

        if ( data.password.text.length < 8 )
          return emitObj (socket, 'signup:res', {
            error: 'Minimum length 8 characters.', field: 'password',
            $close_db: db
          });

        if ( data.password.text != data.password_confirm.text )
          return emitObj (socket, 'signup:res', {
            error: 'Invalid password', field: 'password_confirm',
            $close_db: db
          });

        let currTime = Math.floor (new Date ().getTime () / 1000);

        collection.insertOne ({
          name: data.name.text,
          email: data.email.text.toLowerCase (),
          hash: md5 (username + ':' + data.password.text),
          time_signup: currTime,
          time_login: currTime,
          session: ''
        }, (err, r) => {
          if (err)
            return emitObj (socket, 'signup:res', {
              server_error: 'MongoDB insertOne error. Description: ' + err.message,
              $close_db: db
            }, console.warn);

          emitObj (socket, 'signup:res', { error: null, $close_db: db });
        });
      });
    });
  });
};

export default signup_handle;
