import { MongoClient } from 'mongodb';
import { emitObj } from '../socket_handle';

const latest_handle = (io, socket, data) => {
  if ( typeof process.env.MONGOURI == 'undefined' )
    return emitObj (socket, 'latest:res', {
      server_error: 'Environment variable MONGOURI not found'
    }, console.warn);

  MongoClient.connect (process.env.MONGOURI, (err, db) => {
    if (err)
      return emitObj (socket, 'latest:res', { server_error: err }, console.warn);

    let collection = db.collection ('vote_polls');
    collection.find ({}).sort ({ published_time: -1 }).skip (data.skip).limit (data.limit).toArray (
      (err, docs) => {
        if (err)
          return emitObj (socket, 'latest:res', { error: err, $close_db: db });

        emitObj (socket, 'latest:res', { error: null, polls: docs, $close_db: db });
    });
  });
};

export default latest_handle;
