import { MongoClient } from 'mongodb';
import { emitObj, authUser } from '../socket_handle';

const addpoll_handle = (socket, data) => {
  authUser (data.$user, (err, result) => {
    if ( err )
      return emitObj (socket, 'add-poll:res', { server_error: err }, console.warn);

    if ( !result )
      return emitObj (socket, 'add-poll:res', { error: 'Unauthorized action.' });

    let username = data.$user.name;

    MongoClient.connect (process.env.MONGOURI, (err, db) => {
      if (err)
        return emitObj (socket, 'add-poll:res', { server_error: err}, console.warn);

      let collection = db.collection ('vote_polls');
      /* TODO ... */

      return emitObj (socket, 'add-poll:res', { error: null });
    });
  });
};

export default addpoll_handle;
