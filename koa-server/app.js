/*
 * @Description:入口文件
 * @Author: TangJian
 * @Date: 2020-02-22 20:02:57
 */

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const InitManage = require("./core/init");
// const Joi = require("@hapi/joi");
// require("./app/model/classic");
// require("./app/model/user");
// require("./app/model/book");
const app = new Koa();
// 解析body中间件 。优先级最高
app.use(bodyParser());
// 初始化 自定义core，内部有中间件加载
InitManage.initCore(app);

app.listen(3000);
