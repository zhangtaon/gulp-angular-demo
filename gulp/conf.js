'use strict';

var gulp = require('gulp'),
    util = require('gulp-util'),
    connect = require('gulp-connect'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require("vinyl-source-stream"),
    merge = require("deepmerge"),
    sourcemaps = require('gulp-sourcemaps'),
    templateCache = require('gulp-angular-templatecache'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat'),
    addStream = require('add-stream'),
    rest = require('connect-rest'),
    opn = require('opn'),
    _fs = require('fs'),
    _path = require('path'),
    _rest,_mockDir,
    mock,
    path;

/**
 * 项目中用到的路径
 * @type {{src: string, dist: string, tmp: string, e2e: string, target: string}}
 */
path = exports.path = {
    src: 'app',
    dist: 'dist',
    tmp: '.tmp',
    e2e: 'e2e',
    target: 'target',
    config: '/config/',
    compile: '/compile',
    data: '/data',
    mock: '/mock',
    fonts: '/fonts',
    icon: '/icon'
};

mock = require("../" + path.src + path.mock);

/**
 * gulp错误处理
 * @param e
 */
exports.errorHandler = function(e) {
    'use strict';
    // 控制台发声,错误时beep一下
    util.beep();
    util.log(e);
};

/**
 *  获取所有模板文件
 */
var prepareTemplates = function() {
    return gulp.src(path.src + '/modules/**/*.html')
        .pipe(templateCache({
            module:'app',
            transformUrl: function(url) {
                return 'modules/' + url;
            }
        }));
};

/**
 * 编译js文件 reload
 * @param fileName
 * @param newFileName
 * @param option object
 * option 有以下两个属性
 *      uglify: boolean   是否压缩
 *      rev: boolean      是否加入随机戳
 */
exports.compile = function(fileName,newFileName,option){
    var suffix = ".js",
        min = ".min",
        buildFileName = function(fileName){
            return path.src + path.config + fileName;
        },
        config = {
            uglify: false,
            rev: false
        },outPutDir;

    option && (config = merge(config,option));

    outPutDir = config.rev ? path.dist : path.src + path.compile;

    //处理文件名（字符串或者数组）
    if(typeof fileName == "string"){
        fileName = buildFileName(fileName);
    }else if(fileName instanceof Array){
        fileName = fileName.map(function(x){
            return buildFileName(x);
        });
    }

    var stream = browserify(fileName)
        .bundle()
        .pipe(source(newFileName + suffix))
        .pipe(buffer());

    //添加模板缓存、哈希
    if(config.rev){
        stream = stream
            .pipe(addStream.obj(prepareTemplates()))
            .pipe(gulp.dest(path.tmp))
            .pipe(concat(newFileName + suffix))
            .pipe(rev());
    }
    //输出源文件
    stream = stream.pipe(gulp.dest(outPutDir));

    //哈希但不压缩（注：用于调试）
    if(config.rev && !config.uglify){
        stream = stream
            .pipe(rev.manifest({
                base: outPutDir,
                merge: true
            }))
            .pipe(gulp.dest(outPutDir));
    }

    //生成压缩版js、map文件
    if(config.uglify){
        console.log("压缩中……");
        stream = stream
            //初始化map压缩代码
            .pipe(sourcemaps.init())
            // 在这里将转换任务加入管道
            .pipe(uglify())
            .on('error', util.log)
            .pipe(rename(newFileName + min + suffix));

        if(config.rev){
            stream = stream.pipe(rev());
        }

        stream = stream
            .pipe(sourcemaps.write("./",{
                includeContent: false,
                sourceRoot: ''
            }))
            .pipe(gulp.dest(outPutDir));

        if(config.rev){
            stream = stream
                .pipe(rev.manifest({
                    base: outPutDir,
                    merge: true
                }))
                .pipe(gulp.dest(outPutDir));
        }
    }

    //不哈希情况页面刷新
    if(!config.rev){
        stream.pipe(connect.reload());
    }
    return stream;
};

/**
 * 服务器工厂
 * @param root 服务器的根目录
 */
exports.server = function(root){
    var conn = connect.server({
        root: root,
        port: 8080,
        livereload: true,
        middleware: function(connect, opt) {
            return [rest.rester({
                context: "/"
            })]
        }
    });
    conn.server.addListener('listening',function(){
        opn((conn.https?'https':'http') + '://' + conn.host + ':' + conn.port + "/");
        console.log("browser has open");
    });
    mock(rest, path.src + path.data);
};

/**
 * 读取文件
 * @param mockDir
 * @param fileName
 * @returns {*}
 */
var readFile = function (fileName) {
    return JSON.parse(_fs.readFileSync(_path.join(_mockDir, fileName)), 'utf-8');
};

/**
 * 设置路由变量
 * @param rest
 * @param mockDir
 */
exports.setRoute = function(rest, mockDir){
    _rest = rest;
    _mockDir = mockDir;
};
/**
 * 路由分配
 * @param path
 * @param fileName 假数据文件名
 */
exports.routing = function(path, fileName){
    _rest.assign('*', path, function (req, content, callback) {
        callback(null, readFile(fileName));
    });
};