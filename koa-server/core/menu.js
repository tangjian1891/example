/*
 * @Description:枚举类型
 * @Author: TangJian
 * @Date: 2020-02-24 20:15:04
 */
const LoginType = {
  USER_EMAIL: 100, //邮箱登陆
  USER_MINI_PROGRAM: 101, //小程序
  USER_MOBILE: 102, //手机号
  ADMIN_EMAIL: 200, //用户管理员登陆
  isThisType
};
const ArtType = {
  MOVIE: 100, //电影
  MUSIC: 200, //音乐
  SENTENCE: 300, //文章
  BOOK: 400
};
// 因为传递过来的是key.所以判断是否有对应的key

function isThisType(val) {
  return Object.keys(this).some(item => {
    return this[item] === val;
  });
}
const AuthLevel = {
  USER: 8,
  ADMIN: 16
};

module.exports = {
  LoginType,
  AuthLevel
};
