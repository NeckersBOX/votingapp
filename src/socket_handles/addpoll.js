import { MongoClient } from 'mongodb';
import { emitObj, authUser } from '../socket_handle';

const addpoll_handle = (io, socket, data) => {
  authUser (data.$user, (err, result) => {
    if ( err )
      return emitObj (socket, 'add-poll:res', { server_error: err }, console.warn);

    if ( !result )
      return emitObj (socket, 'add-poll:res', { error: 'Unauthorized action.' });

    let question = data.name.trim ();
    if ( question.length < 6 )
      return emitObj (socket, 'add-poll:res', {
        error: 'Question not valid. Minimum 6 characters.'
      });

    if ( data.options.length < 2 )
      return emitObj (socket, 'add-poll:res', {
        error: 'There must be at least two options.'
      });

    for ( let j in data.options )
      if ( data.options[j].trim ().length < 1 )
        return emitObj (socket, 'add-poll:res', {
          error: 'Invalid options.'
        });

    let username = data.$user.name;

    MongoClient.connect (process.env.MONGOURI, (err, db) => {
      if (err)
        return emitObj (socket, 'add-poll:res', { server_error: err}, console.warn);

      let collection = db.collection ('vote_polls');
      collection.findOne ({}, { 'sort': { _id: -1 } }, (err, doc) => {
        if (err)
          return emitObj (socket, 'add-poll:res', {
            server_error: err,
            $close_db: db
          }, console.warn);

        let new_id = 1;
        if (doc)
          new_id = doc._id + 1;

        collection.insertOne ({
          _id: new_id,
          question: question,
          options: data.options.map ((val) => ({ name: val, votes: 0 })),
          votes: 0,
          published_time: Math.floor (new Date ().getTime () / 1000),
          author: data.$user.name
        }, (err, r) => {
          if (err)
            return emitObj (socket, 'add-poll:res', {
              server_error: err,
              $close_db: db
            }, console.warn);

          emitObj (socket, 'add-poll:res', {
            error: null,
            url: '/poll/' + new_id,
            $close_db: db
          });
        });
      });
    });
  });
};

export default addpoll_handle;
