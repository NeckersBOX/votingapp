'use strict';

const gulp = require ('gulp');
const sass = require ('gulp-sass');
const webpack = require ('webpack-stream');
const del = require ('del');

const files = {
  sass: 'src/sass/*.sass',
  js: 'src/app-client.js'
};

gulp.task ('sass', () => gulp.src (files.sass)
  .pipe (sass ())
  .pipe (gulp.dest ('dist/css'))
);

gulp.task ('webpack', () => gulp.src (files.js)
  .pipe (webpack ({
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
    }
  }))
  .pipe (gulp.dest ('dist/js'))
);

gulp.task ('clean', () => del ([ 'babel_cache' ]));

gulp.task ('watch', () => {
  gulp.watch (files.sass, [ 'sass' ]);
  gulp.watch (files.js, [ 'webpack', 'clean' ]);
});
