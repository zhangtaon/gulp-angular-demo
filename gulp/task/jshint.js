'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    conf = require('../conf');

/**
 * 代码检查
 */
gulp.task("JSHint",function(){
    gulp.src(conf.path.src + "/src/**/*.js")
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("jshint-stylish"))
        //代码规范有错误直接退出
        .pipe(jshint.reporter('fail'))
});