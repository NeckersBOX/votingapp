import { MongoClient } from 'mongodb';
import { emitObj } from '../socket_handle';

const vote_handle = (io, socket, data) => {
  if ( typeof process.env.MONGOURI == 'undefined' )
    return emitObj (socket, 'vote:res', {
      server_error: 'Environment variable MONGOURI not found'
    }, console.warn);

  MongoClient.connect (process.env.MONGOURI, (err, db) => {
    if (err)
      return emitObj (socket, 'vote:res', { server_error: err }, console.warn);

    let collection = db.collection ('vote_polls');
    collection.findOne ({ _id: +data.poll }, (err, doc) => {
      if (err)
        return emitObj (socket, 'vote:res', {
          server_error: err,
          $close_db: db
        }, console.warn);

      if ( !doc )
        return emitObj (socket, 'vote:res', { error: 'Poll not found', $close_db: db });

      doc.options[data.option].votes++;
      doc.votes++;

      collection.findOneAndReplace ({ _id: +data.poll }, doc, (err, r) => {
        if (err)
          return emitObj (socket, 'vote:res', {
            server_error: err,
            $close_db: db
          });

        emitObj (socket, 'vote:res', { error: null, $close_db: db });
        emitObj (io, 'poll:res', { error: null, poll: doc });
      });
    });
  });
};

export default vote_handle;
