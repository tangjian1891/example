/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-28 13:19:59
 */
const { Sequelize, Model } = require("sequelize");
const { db } = require("../../core/db");

class Book extends Model {}

Book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    fav_nums: {
      type: Sequelize.INTEGER,
      default: 0
    }
  },
  {
    tableName: "book",
    sequelize: db
  }
);

module.exports = Book;
