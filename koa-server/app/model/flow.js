/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-25 16:01:13
 */
const { db } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");
class Flow extends Model {}
Flow.init(
  {
    // 定义属性
    index: Sequelize.INTEGER, //期刊序号
    art_id: Sequelize.INTEGER, //业务表.对应实体id
    type: Sequelize.INTEGER //类型
    //
  },
  {
    sequelize: db,
    tableName: "flow"
  }
);
module.exports = Flow;
