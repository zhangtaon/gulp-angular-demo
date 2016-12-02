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
    watchify = require('watchify'),
    _mockDir,
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
    fonts: '/fonts',
    icon: '/icon',
    mock: '/mock',
    role: '/role'
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
    return gulp.src(path.src + '/src/**/*.html')
        .pipe(templateCache({
            module:'app',
            transformUrl: function(url) {
                return '/src/' + url;
            }
        }));
};

/**
 * 编译js文件 reload
 * @param fileName 原文件名 注：两种数据类型：字符串或字符串数组，字符串为开发阶段分类的文件控制，数组为打包时包含多个分类文件的数组
 * @param newFileName 编译后的文件名
 * @param option object
 * option 有以下两个属性
 *      uglify: boolean   是否压缩
 *      rev: boolean
 *      rev 控制多项
 *      1.是否加入随机戳
 *      2.控制输出目录（true: 打包目录，false:编译目录及开发目录）
 *      3.控制是否添加angualr模板缓存
 *      4.不哈希情况页面刷新
 *
 *      构建阶段
 *      {rev:true,uglify:true}
 *
 *      构建阶段调试 哈希但不压缩
 *      {rev:true,uglify:false}
 *
 *      开发阶段 处理公共类库
 *      {rev:false,uglify:true}
 *
 *      开发阶段 业务模块代码 （默认）
 *      {rev:false,uglify:false}
 *
 */
exports.compile = function(fileName,newFileName,option){
    var suffix = ".js",
        min = ".min",
        //构建文件的完整路径
        buildFileName = function(fileName){
            return path.src + path.config + fileName;
        },
        //构建方式默认配置
        config = {
            uglify: false,
            rev: false
        },
        //文件输出目录
        outPutDir,
        stream,
        b;

    option && (config = merge(config,option));

    //控制输出目录（true: 打包目录，false:编译目录及开发目录）
    outPutDir = config.rev ? path.dist : path.src + path.compile;

    //处理文件名（字符串或者数组）
    if(typeof fileName == "string"){
        fileName = buildFileName(fileName);
    }else if(fileName instanceof Array){
        fileName = fileName.map(function(x){
            return buildFileName(x);
        });
    }

    //browerify入口配置参数
    var opts = {
        entries: fileName
    };
    //构建函数
    var bundle = function() {
        console.log("build:",(new Date()).toLocaleString());
        stream = b;
        stream = stream.bundle()
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
    };

    if(!config.rev) {
        b = watchify(browserify(merge(opts,watchify.args)));
        b.on('update', bundle);
//        b.on('log', gutil.log);
    }else{
        b = browserify(opts);
    }
    bundle();
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
    mock(path.src + path.data);
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
exports.setRoute = function(mockDir){
    _mockDir = mockDir;
};
/**
 * 路由分配
 * @param path
 * @param fileName 假数据文件名
 */
exports.routing = function(path, fileName){
    rest.assign('*', path, function (req, content, callback) {
        callback(null, readFile(fileName));
    });
};
exports.unRouting = function(path){
    rest.unassign('*', path);
};