const signup_handle = (data) => {
  console.log (JSON.stringify (data));
};

const socket_handle = (io) => {
  io.on ('connection', (socket) => {
    socket.on ('signup', signup_handle);
  });
};

export default socket_handle;
