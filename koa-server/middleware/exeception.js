/*
 * @Description:自定义的全局异常顶层处理中间件。根据洋葱模型，所有被抛出的异常在这里都会被捕获处理
 * @Author: TangJian
 * @Date: 2020-02-24 16:45:01
 */

/**
 *    异常处理中间件
 * @param {*} ctx  context上下文
 * @param {*} next  放行
 */
async function exeception(ctx, next) {
  try {
    await next();
  } catch (error) {
    const request = `${ctx.method} ${ctx.url}`;
    // error可能是系统错误，也可能是自定义的错误类型
    const isHttpException = error instanceof HttpException;
    // 如果是开发环境。并且是系统异常。直接抛出，便于开发处理
    const isDev = global.config.env === "dev";
    if (isDev && !isHttpException) {
      throw error;
    }
    if (isHttpException) {
      // 确认是自定义异常，从error中取了直接用即可
      ctx.status = error.status;
      let res = {
        msg: error.msg,
        code: error.errorCode,
        request
      };
      if (typeof error.msg !== "string") {
        Object.assign(res, {
          data: error.msg,
          // 重写
          msg: "ok"
        });
      }
      ctx.body = res;
    } else {
      ctx.status = 500;
      // 系统运行时异常。固定处理
      ctx.body = {
        msg: "We made a mistake !",
        code: 9999,
        request
      };
    }
  }
}

// 因为用函数的形式写继承太麻烦了，所以采用es6 class语法糖写
/**
 *我们主要处理自己抛出的异常，也就是自定义异常
 * 所有的异常都是继承于Error。所以我们自定义异常的基类为HttpExeception
 */
class HttpException extends Error {
  constructor(msg = "服务器异常", errorCode = "99999", status = 500) {
    super();
    this.msg = msg;
    this.errorCode = errorCode;
    this.status = status;
  }
}
/**
 * 设置成功响应。其实不算异常-.-.，但是也可以这样做，高度统一
 */
class Success extends HttpException {
  constructor(msg = "ok", errorCode = "0", status = 200) {
    super(msg, errorCode, status);
  }
}
/**
 * 参数错误
 */
class ParamsException extends HttpException {
  constructor(msg = "错误请求，检查参数", errorCode = "10001", status = 400) {
    super(msg, errorCode, status);
  }
}

class NotFoundException extends HttpException {
  constructor(
    msg = "Not Found Target Account",
    errorCode = "10002",
    status = 400
  ) {
    super(msg, errorCode, status);
  }
}
/**
 * 权限不足
 */
class AuthFailed extends HttpException {
  constructor(msg = "禁止访问，请先登录", errorCode = "20001", status = 401) {
    super(msg, errorCode, status);
  }
}
/**
 * 已经点赞
 */
class LikeError extends HttpException {
  constructor(msg = "已经点过赞了", errorCode = "30001", status = 400) {
    super(msg, errorCode, status);
  }
}
/**
 * 已经取消
 */
class DisLikeError extends HttpException {
  constructor(msg = "点赞已取消", errorCode = "30002", status = 400) {
    super(msg, errorCode, status);
  }
}

module.exports = {
  exeception, //异常处理中间件
  HttpException, //自定义异常基类
  Success, //万物皆可抛,成功返回的数据也可以
  ParamsException, //参数错误
  NotFoundException, //没有找到对应账号
  AuthFailed, //权限不足，token失败
  LikeError,
  DisLikeError
};
