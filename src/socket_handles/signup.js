import { MongoClient } from 'mongodb';
import md5 from 'md5';
import { emitObj } from '../socket_handle';

const signup_handle = (socket, data) => {
  let username = data.name.text.toLowerCase ();

  if ( typeof process.env.MONGOURI == 'undefined' )
    return emitObj (socket, 'signup', {
      server_error: 'Environment variable MONGOURI not found'
    }, console.error);

  MongoClient.connect (process.env.MONGOURI, (err, db) => {
    if ( err )
      return emitObj (socket, 'signup', {
        server_error: 'MongoDB connect failed. Description: ' + err.message
      }, console.warn)

    let mail_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let collection = db.collection ('vote_users');

    if ( mail_re.test (data.email.text) != true )
      return emitObj (socket, 'signup', {
        error: 'Please insert a valid email address', field: 'email',
        $close_db: db
      });

    if ( data.name.text.length < 6 )
      return emitObj (socket, 'signup', {
        error: 'Minimum length 6 characters.', field: 'name',
        $close_db: db
      });

    collection.findOne ({
      $or: [ { name: username }, { email: data.email.text.toLowerCase () } ]
    }, (err, doc) => {
      if (err)
        return emitObj (socket, 'signup', {
          server_error: 'MongoDB findOne error. Description: ' + err.message,
          $close_db: db
        }, console.warn);

      if ( doc ) {
        if ( doc.name == username )
          emitObj (socket, 'signup', {
            error: 'Sorry, this username already exists.', field: 'name',
            $close_db: db
          });
        else
          emitObj (socket, 'signup', {
            error: 'Sorry, already exists an account with this email.', field: 'email',
            $close_db: db
          });
      }

      if ( data.password.text.length < 8 )
        return emitObj (socket, 'signup', {
          error: 'Minimum length 8 characters.', field: 'password',
          $close_db: db
        });

      if ( data.password.text != data.password_confirm.text )
        return emitObj (socket, 'signup', {
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
        logged: false
      }, (err, r) => {
        if (err)
          return emitObj (socket, 'signup', {
            server_error: 'MongoDB insertOne error. Description: ' + err.message,
            $close_db: db
          }, console.warn);

        emitObj (socket, 'signup', { error: null, $close_db: db });
      });
    });
  });
};

export default signup_handle;
