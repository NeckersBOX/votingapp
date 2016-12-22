import { MongoClient } from 'mongodb';
import { emitObj } from '../socket_handle';

const poll_handle = (io, socket, data) => {
  if ( typeof process.env.MONGOURI == 'undefined' )
    return emitObj (socket, 'poll:res', {
      server_error: 'Environment variable MONGOURI not found'
    }, console.warn);

  MongoClient.connect (process.env.MONGOURI, (err, db) => {
    if (err)
      return emitObj (socket, 'poll:res', { server_error: err }, console.warn);

    let collection = db.collection ('vote_polls');
    collection.findOne ({ _id: +data.poll_id }, (err, doc) => {
      if (err)
        return emitObj (socket, 'poll:res', {
          server_error: err,
          $close_db: db
        }, console.warn);

      emitObj (socket, 'poll:res', { error: null, poll: doc, $close_db: db });
    });
  });
};

export default poll_handle;
