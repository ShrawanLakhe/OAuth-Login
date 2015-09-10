// grab our gulp packages


'use strict';


var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    nodemon = require('gulp-nodemon'),
    reload = browserSync.reload,
    BROWSER_SYNC_RELOAD_DELAY = 500;


gulp.task('default', ['browser-sync'], function () {

  gulp.watch(['public/**/*.*','app.js','views/**/*.jade','routes/**/*.js','public/*.html','auth/**/*.js'], reload);
});

gulp.task('browser-sync', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({

    // watch the following files; changes will be injected (css & images) or cause browser to refresh
    files: ['public/**/*.*','app.js','views/**/*.jade','routes/**/*.js','auth/**/*.js'],

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:10023',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 10024,
	notify: false,
	injectChanges: false,
    // open the proxied app in chrome
    browser: ["firefox"]
  });
});


gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ],
    // watch core server file(s) that require server restart on change
    watch: ['public/**/*.*','app.js','views/**/*.jade','routes/**/*.js','auth/**/*.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      //setTimeout(function reload() {
      //  browserSync.reload({
       //   stream: false   //
       // });
     // }, BROWSER_SYNC_RELOAD_DELAY);
    });
});


