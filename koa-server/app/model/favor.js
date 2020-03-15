/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-25 21:21:15
 */
const { Sequelize, Model } = require("sequelize");
const { db } = require("../../core/db"); //这是sequelize的实例
class Favor extends Model {}
Favor.init(
  {
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
  },
  {
    sequelize: db,
    tableName: "favor"
  }
);
module.exports = Favor;
