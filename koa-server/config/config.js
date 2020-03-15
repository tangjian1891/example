/*
 * @Description:将硬编码部分抽离到配置中
 * @Author: TangJian
 * @Date: 2020-02-22 20:02:34
 */
module.exports = {
  env: "dev",
  // env: "pro",
  security: {
    secretKey: "suiji$123", //
    expiresIn: 60 * 60
  },
  wx: {
    appId: "wx358f03b2b47dbd07",
    appSecret: "d241e02ef18852f65e6b4588f26f8932",
    loginUrl:
      "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code"
  },
  book: {
    // 指定分类查询 书籍列表
    bookUrl:
      "http://apis.juhe.cn/goodbook/query?key=b8fdf2e0f37124bc0a754edde906c877&catalog_id=246&pn=10&rn=10",
    // 书籍分类
    typeUrl:
      "http://apis.juhe.cn/goodbook/catalog?key=b8fdf2e0f37124bc0a754edde906c877&dtype=json"
  }
  // 默认的书籍接口
  // http://apis.juhe.cn/goodbook/query?key=b8fdf2e0f37124bc0a754edde906c877&catalog_id=246&pn=10&rn=10
  // 书籍分类接口。  没有查询书籍的接口
  // http://apis.juhe.cn/goodbook/catalog?key=b8fdf2e0f37124bc0a754edde906c877&dtype=json
};
