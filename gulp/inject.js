'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function () {
  browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles', 'injectAuth', 'inject404', 'copyVendorImages','move_env'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/main.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], {read: false});

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/assets/js/**/*.js'),
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])
    /*.pipe($.angularFilesort())*/.on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/index.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});

gulp.task('injectAuth', ['stylesAuth'], function () {
   var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/auth.css'),
  ], {read: false});
   var injectScripts = gulp.src([   
    path.join(conf.paths.src, '/alone/alone.js'),
    path.join(conf.paths.src, '/alone/auth.js'),
  ]).on('error', conf.errorHandler('AngularFilesort'));
    var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };
 return gulp.src(path.join(conf.paths.src, '/auth.html'))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});

gulp.task('inject404', ['styles404'], function () {
  return injectAlone({
    css: [path.join('!' + conf.paths.tmp, '/serve/app/vendor.css'), path.join(conf.paths.tmp, '/serve/app/404.css')],
    paths: path.join(conf.paths.src, '/404.html')
  });
});

//auth页面注入js
gulp.task('injectAuthjs', [], function () {
return injectjsAlone({
    js: [path.join('!' + conf.paths.tmp, '/serve/app/vendor.js'), path.join(conf.paths.tmp, '/serve/app/auth.css')],
    paths: [path.join(conf.paths.src, '/auth.html'), path.join(conf.paths.src, '/reg.html')]
  });
});

//移动env.json文件
gulp.task('move_env', [], function () {
return gulp.src(path.join(conf.paths.src, '/env.json'))
 .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});


var injectAlone = function (options) {
  var injectStyles = gulp.src(
    options.css, {read: false});

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(options.paths)
    .pipe($.inject(injectStyles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
};

var injectjsAlone = function (options) {
  var injectScripts = gulp.src(
    options.js, {read: false});



  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(options.paths)
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
};