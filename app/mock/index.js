'use strict';

/**
 * mock api
 * 注：添加路由能追加到已有的路由列表中，删除路由想要生效需要重新启动gulp服务器
 * Created by zto on 2016/8/9.
 */
var conf = require('../../gulp/conf');

/**
 * 配置路由
 * [mocks]
 * @param  {[type]} app [description]
 * @param  {[type]} mockDir [description]
 */
module.exports = function (mockDir) {
    conf.setRoute(mockDir);

    conf.routing("/demo1",'demo1.json');
    conf.routing("/demo2",'demo2.json');
    conf.routing("/login",'login.json');//登录接口
};