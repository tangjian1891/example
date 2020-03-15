/*
 * @Description:初始化由app.js加载
 * @Author: TangJian
 * @Date: 2020-02-22 20:03:02
 */
const { exeception } = require("../middleware/exeception");
const Router = require("@koa/router"); //判断类型用
const requireDirectory = require("require-directory"); //收集路由模块
const InitManager = {
  app: null,
  /**
   * 初始化调用
   * @param {*} app  应用
   */
  initCore(app) {
    // 挂载配置文件
    global.config = require("../config/config");
    // 挂载app
    InitManager.app = app;
    // 初始化异常处理
    app.use(exeception);
    // 初始化路由
    this.initLoadRouters();
  },
  initException() {},
  /**
   * 统一加载所有路由模块
   */
  initLoadRouters() {
    // 路由路径
    const apiDirectory = `${process.cwd()}/app/api`;
    requireDirectory(module, apiDirectory, { visit: whenLoadModule });
    /**
     * 挂载路由的回调
     * @param {*} obj 每一个模块对象
     */
    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes()); //循环注册路由
      }
    }
  }
};

module.exports = InitManager;
