/*
 * @Description:用户路由层(控制层)
 * @Author: TangJian
 * @Date: 2020-02-22 20:00:23
 */
const { ParamsException, Success } = require("../../../middleware/exeception");
const Router = require("@koa/router");
const { registerValidator } = require("../../../core/validator");
const User = require("../../model/user");
const router = new Router({
  prefix: "/v1/user"
});

/**
 * 注册接口
 */
router.post("/register", async (ctx, next) => {
  const res = registerValidator(ctx);
  const user = {
    email: res["account"],
    password: res["password"],
    nickname: res["nickname"]
  };
  try {
    const r = await User.create(user);
  } catch (error) {
    // 省了一步，没有校验账号是否存在，设置邮箱为唯一
    throw new ParamsException("邮箱已被注册");
  }
  throw new Success("注册成功");
});

module.exports = router;
