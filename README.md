# Vote App

![Build Passed](https://img.shields.io/badge/build-passed-lightgrey.svg)
![Status Alpha](https://img.shields.io/badge/status-alpha-bronze.svg)

## Free Code Camp Challenge

This app was built in MERN stack. It uses: MongoDB, Node, Express, React, React Router, Redux, Socket.IO and Material-UI.

_Note_: Server and client components are _isomorphic_.

### `process.env`
* __MONGOURI__: your query to authenticate in mongodb server `mongodb://<dbuser>:<dbpassword>@ds119508.mlab.com:19508/neckersbox`
* __NODE_ENV__: for example `production`. _Note_: this must be the same between server and client.

### Scripts
To compile or run this app use gulp and/or npm.
* __Build__: `gulp build`
* __Watch__: `gulp watch` or `npm run watch`
* __Clean__: `gulp clean`
* __Start Server__: `gulp start` or `npm run start-server`
_Note_: normally `start-server` hide console messages, to show them you should exec `npm run start-server-debug`
