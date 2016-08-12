'use strict';

const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

const conf = require('./config/development');

gulp.task('dev', ['start']);

gulp.task('test', () => {
  return gulp.src(conf.gulp.tests, {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('start', () => {
  nodemon({
    script: 'app.js',
    ext: 'js pug',
    env: { 'NODE_ENV': 'development' }
  })
});

