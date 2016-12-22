import { MongoClient } from 'mongodb';
import { emitObj } from '../socket_handle';

const popular_handle = (io, socket, data) => {
  if ( typeof process.env.MONGOURI == 'undefined' )
    return emitObj (socket, 'popular:res', {
      server_error: 'Environment variable MONGOURI not found'
    }, console.warn);

  MongoClient.connect (process.env.MONGOURI, (err, db) => {
    if (err)
      return emitObj (socket, 'popular:res', { server_error: err }, console.warn);

    let collection = db.collection ('vote_polls');
    collection.find ({}).sort ({ votes: -1 }).skip (data.skip).limit (data.limit).toArray (
      (err, docs) => {
        if (err)
          return emitObj (socket, 'popular:res', { error: err, $close_db: db });

        emitObj (socket, 'popular:res', { error: null, polls: docs, $close_db: db });
    });
  });
};

export default popular_handle;
