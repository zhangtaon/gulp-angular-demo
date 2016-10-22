'use strict';

/**
 * mock api
 * Created by zto on 2016/8/9.
 */
var conf = require('../../gulp/conf');

/**
 * 配置路由
 * [mocks]
 * @param  {[type]} app [description]
 * @param  {[type]} mockDir [description]
 */
module.exports = function (rest, mockDir) {
    conf.setRoute(rest, mockDir);

    conf.routing("/demo1",'demo1.json');
    conf.routing("/demo2",'demo2.json');
    conf.routing("/login",'login.json');
};