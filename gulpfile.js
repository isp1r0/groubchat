'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var jadelint = require('gulp-jadelint');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');

gulp.task('serve', function () {
  livereload.listen();
  nodemon({ script: 'bin/www',
            ext: 'js',
            env: { 'NODE_ENV': 'development', DEBUG: 'lausn:*' },
            watch: ['bin/www', 'app.js','routes/**/*', 'views/**/*']
          })
    .on('restart', function() {
      livereload.changed();
    });
});

gulp.task('jshint', function () {
  return gulp.src(['./*.js', './routes/**/*.js', './lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function () {
  return gulp.src(['./lib/*.test.js'])
    .pipe(mocha({ reporter: 'dot' }));
});

gulp.task('jadelint', function () {
  return gulp.src('views/*.jade')
    .pipe(jadelint());
});

gulp.task('inspect', ['jshint', 'test', 'jadelint']);

gulp.task('default', ['inspect', 'serve']);
