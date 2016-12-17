'use strict';

const gulp = require ('gulp');
const minify = require ('gulp-minify');
const sass = require ('gulp-sass');
const webpack = require ('webpack');
const webpackStream = require ('webpack-stream');
const del = require ('del');
const exec = require('child_process').exec;
const runSequence = require ('run-sequence');

const files = {
  sass: 'src/sass/**/*.sass',
  js: 'src/**/*.js',
  dist: 'dist/**/*.js'
};

gulp.task ('sass', () => gulp.src (files.sass)
  .pipe (sass ())
  .pipe (gulp.dest ('dist/css'))
);

gulp.task ('webpack', (cb) =>
  gulp.src ('src/app-client.js')
    .pipe (webpackStream ({
      output: {
        filename: 'bundle.js'
      },
      module: {
        loaders: [{
          loader: ['babel-loader'],
          query: {
            cacheDirectory: 'babel_cache',
            presets: ['react', 'es2015']
          }
        }]
      },
      plugins: [
        new webpack.DefinePlugin ({
          'process.env': {
            NODE_ENV: process.env.NODE_ENV || '"production"'
          }
        })
      ],
    }))
    .pipe(minify())
    .pipe (gulp.dest ('dist/js'))
);

gulp.task ('clean', () => del ([ 'babel_cache' ]));
gulp.task ('build', [ 'sass', 'webpack' ]);

gulp.task ('end', (cb) => {
  console.log ('Kill server if up.. ');
  exec ('npm run stop-server',
    (err, stdout, stderr) => {
      console.log (stdout);
      console.log (stderr);
      cb (err);
    }
  );
});

gulp.task ('start', (cb) => {
  console.log ('Start server with babel-node. http://localhost:3000');
  exec ('npm run start-server',
    (err, stdout, stderr) => {
      console.log (stdout);
      console.log (stderr);
      cb (err);
    }
  )
});

gulp.task ('watch', () => {
  gulp.watch (files.sass, [ 'sass' ]);
  gulp.watch (files.js, () => runSequence ('end', 'webpack', 'start'));
});
