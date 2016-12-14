const initState = {
  io: null,
  trending: [],
  popular: [],
  latest: []
};

const voteReducer = (state, action) => {
  if ( typeof state === 'undefined' ) {
    return initState;
  }

  const callbacks = {
    'SET_SOCKET_IO': setSocketIO
  };

  return callbacks[action.type] (state, action.data)
};

const setSocketIO = (state, data) => Object.assign ({}, state, { io: data });

export default voteReducer;
