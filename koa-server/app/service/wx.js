/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-25 14:43:32
 */
const util = require("util");
const User = require("../model/user");
const { generateToken } = require("../../core/auth");
const { AuthLevel } = require("../../core/menu");

class WXManager {
  static async codeToToken(code) {
    // email password
    // code 小程序生成 微信
    // openid 唯一标识 鉴定
    // 显示注册 唯一标识
    // code appid appsecret
    // 每一个小城都有 一个 appid appsecret
    const url = util.format(
      global.config.wx.loginUrl,
      global.config.wx.appId,
      global.config.wx.appSecret,
      code
    );
    const axios = require("axios");
    const res = await axios.get(url);
    if (res.status !== 200) {
      throw new global.errs.AuthFailed("openid获取失败");
    }
    let errCode = res.data.errcode;
    let errMsg = res.data.errmsg;
    if (errCode) {
      throw new global.errs.AuthFailed("openid获取失败" + errMsg);
    }
    if (res.data.openid) {
      // -1	系统繁忙，此时请开发者稍候再试
      // 0	请求成功
      // 40029	code 无效
      // 45011	频率限制，每个用户每分钟100次

      // 确认微信用户，换取openid成功
      let user = await getUserByOpenId(res.data.openid);
      if (!user) {
        user = registerByOpenId(res.data.openid);
      }
      return await generateToken(user.id, AuthLevel.USER);
    }
  }
}
/**
 * 根据openid获取用户
 * @param {*} openId
 */
async function getUserByOpenId(openId) {
  const user = await User.findOne({
    where: {
      openid: openId
    }
  });

  return user;
}
async function registerByOpenId(openid) {
  return await User.create({
    openid
  });
}
module.exports = {
  WXManager
};
