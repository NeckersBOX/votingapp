const initState = {
  io: null,
  user: null
};

const voteReducer = (state, action) => {
  if ( typeof state === 'undefined' ) {
    return initState;
  }

  const callbacks = {
    'SET_SOCKET_IO': setSocketIO,
    'EMIT_SOCKET_IO': emitSocketIO,
    'SET_USER': setUser
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

const setUser = (state, action) => {
  localStorage.setItem ('__voteapp_session', JSON.stringify (action.data));
  return Object.assign ({}, state, { user: action.data });
}

export default voteReducer;
