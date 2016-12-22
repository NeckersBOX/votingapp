import { MongoClient } from 'mongodb';
import { emitObj, authUser } from '../socket_handle';

const logout_handle = (io, socket, data) => {
  authUser (data.$user, (err, result) => {
    if (err)
      return emitObj (socket, 'logout:res', { server_error: err }, console.warn);

    if ( !result )
      return emitObj (socket, 'logout:res', { error: null });

    MongoClient.connect (process.env.MONGOURI, (err, db) => {
      if (err)
        return emitObj (socket, 'logout:res', {
          server_error: 'MongoDB connect failed. Description: ' + err.message
        }, console.warn);

      let collection = db.collection ('vote_users');

      collection.findOne ({ session: data.$user.session }, (err, doc) => {
        if (err)
          return emitObj (socket, 'logout:res', {
            server_error: 'MongoDB findOne failed. Description: ' + err.message,
            $close_db: db
          }, console.warn);

        if (!doc)
          return emitObj (socket, 'logout:res', { error: null, $close_db: db });

        collection.findOneAndUpdate ({
          session_id: data.$user.session
        }, Object.assign ({}, doc, { session: '' }), (err, r) => {
          if (err)
            return emitObj (socket, 'logout:res', {
              server_error: 'MongoDB findOneAndModify failed. Description: ' + err.message,
              $close_db: db
            }, console.warn);

          return emitObj (socket, 'logout:res', { error: null, $close_db: db });
        });
      });
    });

    return emitObj (socket, 'logout:res', { error: null });
  });
};

export default logout_handle;
