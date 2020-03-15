/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-24 19:19:57
 */
const Sequelize = require("sequelize");
const sequelize = new Sequelize("summer", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
  port: "3306",
  timezone: "+08:00",
  logging: false,
  define: {
    timestamps: true,
    paranoid: true
  }
});
// 不强制更新
sequelize.sync({
  force: false
});
module.exports = {
  db: sequelize
};
