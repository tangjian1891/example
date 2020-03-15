/*
 * @Description:包含解析token
 * @Author: TangJian
 * @Date: 2020-02-25 10:29:25
 */
const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");
const { AuthFailed } = require("../middleware/exeception");
const { AuthLevel } = require("../core/menu");
/**
 *
 * @param {*} uid
 * @param {*} scope 该用户的权限等级
 */
function generateToken(uid, scope) {
  const secretKey = global.config.security.secretKey;
  const expiresIn = global.config.security.expiresIn;
  const token = jwt.sign(
    {
      uid,
      scope
    },
    secretKey,
    {
      expiresIn
    }
  );
  return token;
}

// 使用闭包。判断权限等级是否足够
function validatorAuth(level) {
  return async function(ctx, next) {
    // 直接拿token, 要的是原生node.js的request请求
    const userToken = basicAuth(ctx.req);
    if (!userToken || !userToken.name) {
      throw new AuthFailed("权限不足,请先登录&&切换更高权限账号");
    }
    // 解析token
    let decode;
    try {
      decode = jwt.verify(userToken.name, global.config.security.secretKey);
    } catch (error) {
      // 两种异常。token不合法  token过期
      if (error.name == "TokenExpiredError") {
        throw new AuthFailed("token令牌已过期");
      }
      throw new AuthFailed("token不合法");
    }
    // 看一下这个权限是否满足
    if (decode.scope < level) {
      throw new AuthFailed("权限等级不足");
    }
    //因为是中间件的原因，传递数据的方式为挂载在ctx上面
    ctx.auth = {
      uid: decode.uid,
      scope: decode.scope
    };
    await next();
  };
  // 初始化
}
/**
 * 验证token是否合法有效
 */
function verifyToken(ctx) {
  const userToken = basicAuth(ctx.req);

  try {
    const token = userToken.name;
    let decode = jwt.verify(token, global.config.security.secretKey);
    // 直接挂上去
    ctx.auth = {
      uid: decode.uid,
      scope: decode.scope
    };
    return true;
  } catch (error) {
    return false;
  }
}
// 增加验证token 的中间件
async function verifyToken2(ctx, next) {
  const userToken = basicAuth(ctx.req);
  try {
    const token = userToken.name;
    let decode = jwt.verify(token, global.config.security.secretKey);
    // 直接挂上去
    ctx.auth = {
      uid: decode.uid,
      scope: decode.scope
    };
  } catch (error) {
    throw new AuthFailed("Token过期或失效l");
  }
  await next();
}
module.exports = {
  generateToken, //生成token
  validatorAuth, //校验权限
  verifyToken,
  verifyToken2 //这是中间件
};
