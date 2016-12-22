import { MongoClient } from 'mongodb';
import { emitObj, authUser } from '../socket_handle';

const mypolls_handle = (io, socket, data) => {
  authUser (data.$user, (err, result) => {
    if ( err )
      return emitObj (socket, 'my-polls:res', { server_error: err }, console.warn);

    if ( !result )
      return emitObj (socket, 'my-polls:res', { error: 'Unauthorized action.' });

    MongoClient.connect (process.env.MONGOURI, (err, db) => {
      if (err)
        return emitObj (socket, 'my-polls:res', { server_error: err}, console.warn);

      let collection = db.collection ('vote_polls');
      collection.find ({
        author: data.$user.name
      }).toArray ((err, docs) => {
        if (err)
          return emitObj (socket, 'my-polls:res', {
            server_error: err,
            $close_db: db
          }, console.warn);

        emitObj (socket, 'my-polls:res', { error: null, polls: docs, $close_db: db });
      });
    });
  });
};

export default mypolls_handle;
