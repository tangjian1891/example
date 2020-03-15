/*
 * @Description:用户模型层。在这也可以定义用户相关的逻辑代码(项目较少，替代service层)
 * @Author: TangJian
 * @Date: 2020-02-22 20:05:19
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../../core/db");
const { Sequelize, Model } = require("sequelize");
class User extends Model {}
// 初始化模型
User.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nickname: Sequelize.STRING,
    email: {
      type: Sequelize.STRING(128),
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      set(val) {
        bcrypt.genSaltSync(10);
        const pwd = bcrypt.hashSync(val);
        this.setDataValue("password", pwd);
      }
    },
    openid: {
      type: Sequelize.STRING(64),
      unique: true
    }
  },
  {
    sequelize: db,
    tableName: "user",
    updatedAt: "update_at",
    createdAt: "created_at",
    deletedAt: "deleted_at"
  }
);
module.exports = User;
