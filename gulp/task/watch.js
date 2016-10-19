'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    replace = require('gulp-replace'),
    urlAdjuster = require('gulp-css-url-adjuster'),
    conf = require('../conf');

/**
 *  watch assert
 */
gulp.task('watch', function () {
    //watch html directory
    gulp.watch(conf.path.src + '/**/*.html', ['html']);

    //watch less
    gulp.watch(conf.path.src + '/**/*.less', ['less']);

    //watch icon
    gulp.watch(conf.path.src + conf.path.icon + '/*.svg', ['icon-font']);

    //watch business browerify
    gulp.watch(conf.path.src + conf.path.config + 'browserify.js', ['browserify']);

    //watch vendor browerify
    gulp.watch(conf.path.src + conf.path.config + 'browserify-lib.js', ['browserify-lib']);

    //watch business module
    gulp.watch(conf.path.src + '/modules/**/*.js', ['browserify']);
});

/**
 * html reload
 */
gulp.task('html', function () {
    gulp.src(conf.path.src + '/**/*.html')
        .pipe(connect.reload());
});

/**
 * less reload
 */
gulp.task('less', function () {
    return gulp.src(conf.path.src + conf.path.config + 'app.less')
        .pipe(plumber({errorHandler: conf.errorHandler}))
        .pipe(less())
        .pipe(replace(/\.\.\//g, ''))
        .pipe(urlAdjuster({
            prepend: '../'
        }))
        .pipe(gulp.dest(conf.path.src + conf.path.compile))
        .pipe(connect.reload());
});

/**
 * 合并js脚本——公共类库 reload
 */
gulp.task("browserify-lib",function(){
    conf.compile("browserify-lib.js",'lib',{uglify:true});
});

/**
 * 合并js脚本——业务模块 reload
 */
gulp.task("browserify",function(){
    conf.compile("browserify.js",'app');
});
