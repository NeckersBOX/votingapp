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
    'SET_SOCKET_IO': setSocketIO,
    'EMIT_SOCKET_IO': emitSocketIO
  };

  return callbacks[action.type] (state, action)
};

const setSocketIO = (state, action) => Object.assign ({}, state, { io: action.data });
const emitSocketIO = (state, action) => {
  if ( state.io === null ) {
    console.warn ('emitSocketIO: Failed emit, IO null.');
    return state;
  }

  state.io.emit (action.api, action.data);
  return state;
};

export default voteReducer;
