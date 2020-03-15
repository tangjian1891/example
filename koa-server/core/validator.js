/*
 * @Description:所有的校验规则抽离到这里
 * @Author: TangJian
 * @Date: 2020-02-24 19:55:27
 */
const { LoginType } = require("../core/menu");
const { ParamsException } = require("../middleware/exeception");
const Joi = require("@hapi/joi");
/**
 * 邮箱注册.
 * body:account password repeatPassword nickname type
 */
function registerValidator(ctx) {
  // 判断注册类型
  const type = parseInt(ctx.request.body["type"]);
  if (!LoginType.isThisType(type)) {
    throw new ParamsException("类型参数是必须的");
  }
  //  邮箱类型
  const schema = Joi.object({
    account: Joi.string()
      .email()
      .trim()
      .required(),
    nickname: Joi.string()
      .min(2)
      .trim()
      .max(6),
    password: Joi.string()
      .min(6)
      .max(12)
      .trim()
      .required(),
    repeatPassword: Joi.ref("password")
  }).with("password", "repeatPassword");
  const { account, nickname, password, repeatPassword } = ctx.request.body;
  const res = schema.validate({
    account,
    nickname,
    password,
    repeatPassword
  });
  if (res.error) {
    throw new ParamsException("参数不正确");
    return;
  }
  // 返回解析后的数据
  return res.value;
}

/**
 * 登录
 */
async function loginValidator(ctx) {
  const currentType = parseInt(ctx.request.body["type"]);
  if (!LoginType.isThisType(currentType)) {
    throw new ParamsException("类型参数是必须的");
  }
  const schema = Joi.object({
    account: Joi.string()
      .email()
      .trim(),
    password: Joi.string()
      .min(6)
      .max(12)
      .trim(),
    openid: Joi.string(),
    type: Joi.number().required()
  });
  const { account, password, type, openid } = ctx.request.body;
  let result = schema.validate({
    account,
    password,
    openid,
    type
  });
  if (result.error) {
    throw new ParamsException("参数有误");
  }
  return result.value;
}
/**
 * 点赞的参数校验
 * like
 */
function likeValidator(ctx) {
  // 校验 art_id, type, uid
  let body = ctx.request.body;
  const schema = Joi.object({
    art_id: Joi.number().required(),
    type: Joi.number().required()
  });
  let result = schema.validate({
    art_id: body["art_id"],
    type: body["type"]
  });
  if (result.error) {
    throw new ParamsException();
  }
  return result.value;
}
/**
 * 校验用户对 期刊 的点赞的情况
 */
function favorValidator(ctx) {
  const params = ctx.params;
  let schema = Joi.object({
    type: Joi.number().required(),
    id: Joi.number().required()
  });
  let res = schema.validate({
    type: params.type,
    id: params.id
  });
  if (res.error) {
    throw new ParamsException("参数有误");
  }
  return res.value;
}
module.exports = {
  registerValidator,
  loginValidator,
  likeValidator,
  favorValidator
};
