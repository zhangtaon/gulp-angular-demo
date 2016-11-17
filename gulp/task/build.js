'use strict';

var gulp = require('gulp'),
    less = require('gulp-less'),
    rev = require('gulp-rev'),
    imagemin = require('gulp-imagemin'),
    htmlReplace = require('gulp-html-replace'),
    cssmin = require('gulp-cssmin'),
    htmlmin = require('gulp-htmlmin'),
    revReplace = require('gulp-rev-replace'),
    replace = require('gulp-replace'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    gulpSequence = require('gulp-sequence'),
    filter = require('gulp-filter'),
    argv = require('yargs').argv,
    conf = require('../conf'),
    min = argv.min ? argv.min == 'true' ? true : false : true;
/**
 * dist: js
 */
gulp.task("build:js", function(){
    return conf.compile(["browserify-lib.js","browserify.js"],'app',{uglify:min, rev:true});
});

/**
 * dist: css
 */
gulp.task("build:css",function(){
    return gulp.src(conf.path.src + conf.path.compile + "/*.css")
        .pipe(cssmin())
        .pipe(rename("app.min.css"))
        .pipe(rev())
        .pipe(gulp.dest(conf.path.dist))
        .pipe(rev.manifest({
            base: conf.path.dist,
            merge: true
        }))
        .pipe(gulp.dest(conf.path.dist));
});

/**
 * dist: image
 */
gulp.task("build:image",function(){
    return gulp.src(conf.path.src + "/image/*")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }]}))
        .pipe(rev())
        .pipe(gulp.dest(conf.path.dist + '/image'))
        .pipe(rev.manifest({
            base: conf.path.dist,
            merge: true
        }))
        .pipe(gulp.dest(conf.path.dist));
});

/**
 * dist: html
 */
gulp.task('build:html', function () {
    return gulp.src(conf.path.src + '/*.html')
        .pipe(htmlReplace({
            css: {
                src: 'app.min.css',
                tpl: '<link rel="stylesheet" href="%s">'
            },
            js: {
                src: min ? 'app.min.js' : 'app.js',
                tpl: '<script type="text/javascript" src="%s"></script>'
            }
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(conf.path.dist));
});

/**
 * dist: font
 */
gulp.task('build:font',function(){
    return gulp.src(conf.path.src + conf.path.fonts + "/*")
        .pipe(gulp.dest(conf.path.dist + conf.path.fonts));
});

/**
 * dist: role
 */
gulp.task('build:role',function(){
    return gulp.src(conf.path.src + conf.path.role + "/*")
        .pipe(gulp.dest(conf.path.dist + conf.path.role));
});

/**
 * replace
 */
gulp.task('replace', function() {
    return gulp.src([conf.path.dist + '/*.css', conf.path.dist + '/*.js', conf.path.dist + '/*.html'])
        .pipe(replace(/\.\.\//g, ''))
//        .pipe(replace(/\.\//g, ''))
        .pipe(revReplace({
//            manifest: gulp.src(conf.path.dist + '/rev-manifest.json')
            manifest: gulp.src('rev-manifest.json')
        }))
        .pipe(gulp.dest(conf.path.dist));
});

/**
 * clean
 */
gulp.task('clean', function () {
  return gulp.src([conf.path.dist], {read: false})
    .pipe(clean());
});

/**
 * clean:tmp
 */
gulp.task('clean:tmp', function () {
    return gulp.src([conf.path.tmp], {read: false})
        .pipe(clean());
});

gulp.task('build',gulpSequence(['clean'],['build:image','build:js','build:css','build:html','build:font','build:role'],['replace','clean:tmp']));