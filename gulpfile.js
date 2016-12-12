'use strict';

const gulp = require ('gulp');
const sass = require ('gulp-sass');

const files = {
  sass: 'src/sass/**/*.sass'
};

gulp.task ('sass', gulp.src (files.sass).pipe (sass ()).pipe (gulp.dest ('dist/css')));

gulp.task ('watch', () => {
  gulp.watch (files.sass, [ 'sass' ]);
});
