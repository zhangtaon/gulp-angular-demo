'use strict';

/**
 *  require each task
 */

require('require-dir')('./task');
var gulp = require('gulp');

gulp.task('default',['dev:server','watch','browserify-lib','browserify','less','icon-font']);
gulp.task('dist',['dist:server']);
