'use strict';

var gulp = require('gulp'),
 connect = require('gulp-connect'),
 conf = require('../conf');

/**
 * 本地开发：服务启动任务
 */
gulp.task("dev:server", function() {
    conf.server(conf.path.src);
});

/**
 * 打包后：服务启动任务
 */
gulp.task("dist:server", function() {
    conf.server(conf.path.dist);
});