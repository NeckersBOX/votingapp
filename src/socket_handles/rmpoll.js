import { MongoClient } from 'mongodb';
import { emitObj, authUser } from '../socket_handle';

const rmpoll_handle = (io, socket, data) => {
  authUser (data.$user, (err, result) => {
    if ( err )
      return emitObj (socket, 'rm-poll:res', { server_error: err }, console.warn);

    if ( !result )
      return emitObj (socket, 'rm-poll:res', { error: 'Unauthorized action.' });

    MongoClient.connect (process.env.MONGOURI, (err, db) => {
      if (err)
        return emitObj (socket, 'rm-poll:res', { server_error: err }, console.warn);

      let collection = db.collection ('vote_polls');
      collection.findOneAndDelete ({
        _id: data.poll_id,
        author: data.$user.name
      }, (err, r) => {
        if (err)
          return emitObj (socket, 'rm-poll:res', {
            server_error: err,
            $close_db: db
          }, console.warn);

        emitObj (socket, 'rm-poll:res', { error: null, $close_db: db });
      });
    });
  });
};

export default rmpoll_handle;
