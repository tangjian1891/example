/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-22 20:00:28
 */
const Router = require("@koa/router");
const bcrypt = require("bcryptjs");
const { loginValidator } = require("../../../core/validator"); //参数校验
const { LoginType, AuthLevel } = require("../../../core/menu"); //枚举 登录类型,权限等级
const User = require("../../model/user"); //用户模型
const { WXManager } = require("../../service/wx");
const {
  NotFoundException,
  ParamsException,
  Success
} = require("../../../middleware/exeception"); //错误处理
const {
  generateToken,
  validatorAuth,
  verifyToken
} = require("../../../core/auth");
const router = new Router({
  prefix: "/v1/login"
});
/**
 * 登录 接口
 */
router.post("/", async ctx => {
  console.log("进入");
  const result = await loginValidator(ctx);
  // 根据type判断是哪种 登陆
  let token;
  switch (result["type"]) {
    case LoginType.USER_EMAIL:
      // 按说这里应该去service层中调用业务代码。不分层，直接在下面写逻辑了
      token = await emailLogin(result["account"], result["password"]);
      break;
    case LoginType.USER_MINI_PROGRAM:
      // 小程序登录.只拿openid即可，在count字段中
      token = await WXManager.codeToToken(result["openid"]);
      break;
    default:
      throw new ParamsException("登录类型不符");
      break;
  }
  throw new Success({
    token
  });
});
/**
 * 测试权限接口 校验token的中间件validatorAuth
 * 此中间件因为既需要验证token，也需要验证权限等级
 *可能有
 */
router.post("/verify", validatorAuth(6), async ctx => {
  throw new Success("权限通过");
});
// 业务相关
async function emailLogin(email, plainPassword) {
  // 流程->查库，加密。对比两个加密后的是否一样
  const user = await User.findOne({
    where: {
      email
    }
  });
  if (!user) {
    throw new NotFoundException("邮箱不存在");
  }
  // 对比密码
  const correct = bcrypt.compareSync(plainPassword, user.password);
  if (!correct) {
    throw new NotFoundException("密码不正确");
  }
  // 对比成功。生成token.所有邮箱登录用户默认等级
  return generateToken(user.id, AuthLevel.USER);
}
module.exports = router;
