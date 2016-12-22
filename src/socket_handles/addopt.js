import { MongoClient } from 'mongodb';
import { emitObj, authUser } from '../socket_handle';

const addpoll_handle = (io, socket, data) => {
  authUser (data.$user, (err, result) => {
    if ( err )
      return emitObj (socket, 'add-opt:res', { server_error: err }, console.warn);

    if ( !result )
      return emitObj (socket, 'add-opt:res', { error: 'Unauthorized action.' });

    if ( data.option.trim ().length < 1 )
      return emitObj (socket, 'add-opt:res', {
        error: 'Invalid option.'
      });

    MongoClient.connect (process.env.MONGOURI, (err, db) => {
      if (err)
        return emitObj (socket, 'add-opt:res', { server_error: err }, console.warn);

      let collection = db.collection ('vote_polls');
      collection.findOne ({ _id: +data.poll._id }, (err, doc) => {
        if (err)
          return emitObj (socket, 'add-opt:res', {
            server_error: err,
            $close_db: db
          }, console.warn);

        if (!doc)
          return emitObj (socket, 'add-opt:res', {
            error: 'Poll not found.',
            $close_db: db
          });

        let new_doc = doc;
        new_doc.options.push ({ name: data.option.trim (), votes: 0 });

        collection.findOneAndReplace ({ _id: +data.poll._id }, new_doc, (err, r) => {
          if (err)
            return emitObj (socket, 'add-opt:res', {
              server_error: err,
              $close_db: db
            });

          emitObj (socket, 'add-opt:res', { error: null, $close_db: db });
          emitObj (io, 'poll:res', { error: null, poll: new_doc });
        });
      });
    });
  });
};

export default addpoll_handle;
