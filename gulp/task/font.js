'use strict';

var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var conf = require('../conf');

var runTimestamp = Math.round(Date.now()/1000);
var fontName = 'font-custom';

/**
 * 生成字体文件样式
 */
gulp.task('icon-font', function(){
    gulp.src([conf.path.src + '/icon/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName,
            path: 'less',
            targetPath: '../less/' + fontName + '.less',
            fontPath: '../fonts/',
            cssClass: 'jdb'
        }))
        .pipe(iconfont({
            fontName: fontName,
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff','woff2','svg'], //default, 'woff2' and 'svg' are available
            timestamp: runTimestamp // recommended to get consistent builds when watching files
        }))
        .pipe(gulp.dest(conf.path.src + conf.path.fonts));
});

/**
 * 转移拷贝
 */
gulp.task('transfer',function(){
    gulp.src("node_modules/font-awesome/fonts/*")
        .pipe(gulp.dest(conf.path.src + conf.path.fonts));
});