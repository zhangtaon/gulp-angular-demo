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
gulp.task('watch', ['browserify','less'],function () {

    //watch router mock directory
    gulp.watch(conf.path.src + '/mock/*.js', ['mock']);

    //watch html、data、role
    gulp.watch([
            conf.path.src + '/**/*.html',
            conf.path.src + '/data/*.json',
            conf.path.src + '/role/*.json'
    ], ['html-data-role']);

    //watch less
    gulp.watch(conf.path.src + '/**/*.less', ['less']);

    //watch icon
    gulp.watch(conf.path.src + conf.path.icon + '/*.svg', ['icon-font']);

});

/**
 * 路由列表 reload
 */
gulp.task('mock', function () {
    var path = "../../" + conf.path.src + conf.path.mock;
    delete require.cache[require.resolve(path)];
    require(path)(conf.path.src + conf.path.data);
});

/**
 *  html、data（假数据）、role（角色） reload
 */
gulp.task('html-data-role', function () {
    gulp.src([
            conf.path.src + '/**/*.html',
            conf.path.src + '/data/*.json',
            conf.path.src + '/role/*.json'
    ]).pipe(connect.reload());
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
 * 合并js脚本 reload
 */
gulp.task("browserify",function(){
    //合并js脚本——业务模块 reload
    conf.compile("browserify.js",'app');
    //合并js脚本——公共类库 reload
    conf.compile("browserify-lib.js",'lib',{uglify:true});
});
