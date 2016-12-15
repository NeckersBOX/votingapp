import { MongoClient } from 'mongodb';
import md5 from 'md5';

const emitObj = (socket, type, object, log = null) => {
  if ( log ) log (JSON.stringify (object));

  socket.emit (type, object);
  return true;
};

const signup_handle = (socket, data) => {
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
        error: 'Please insert a valid email address', field: 'email'
      });

    if ( data.name.text.length < 6 )
      return emitObj (socket, 'signup', {
        error: 'Minimum length 6 characters.', field: 'name'
      });

    collection.findOne ({
      $or: [
        { name: data.name.text },
        { email: data.email.text }
      ]
    }, (err, doc) => {
      if (err)
        return emitObj (socket, 'signup', {
          server_error: 'MongoDB findOne error. Description: ' + err.message
        }, console.warn);

      if ( doc ) {
        if ( doc.name == data.name.text )
          return emitObj (socket, 'signup', {
            error: 'Sorry, this username already exists.', field: 'name'
          });
        else
          return emitObj (socket, 'signup', {
            error: 'Sorry, already exists an account with this email.', field: 'email'
          });

        return;
      }

      if ( data.password.text.length < 8 )
        return emitObj (socket, 'signup', {
          error: 'Minimum length 8 characters.', field: 'password'
        });

      if ( data.password.text != data.password_confirm.text )
        return emitObj (socket, 'signup', {
          error: 'Invalid password', field: 'password_confirm'
        });

      let currTime = Math.floor (new Date ().getTime () / 1000);

      collection.insertOne ({
        name: data.name.text,
        email: data.email.text,
        hash: md5 (data.name.text + ':' + data.password.text),
        time_signup: currTime,
        time_login: currTime,
        logged: false
      }, (err, r) => {
        if (err)
          return emitObj (socket, 'signup', {
            server_error: 'MongoDB insertOne error. Description: ' + err.message
          }, console.warn);

        emitObj (socket, 'signup', { error: null });
        db.close ();
      });
    });
  });
};

const socket_handle = (io) => {
  io.on ('connection', (socket) => {
    socket.on ('signup', (data) => signup_handle (socket, data));
  });
};

export default socket_handle;
