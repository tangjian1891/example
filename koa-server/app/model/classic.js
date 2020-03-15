/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-25 16:01:01
 */
const { Sequelize, Model } = require("sequelize");
const { db } = require("../../core/db");

const classicFields = {
  image: Sequelize.STRING,
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
    type: Sequelize.INTEGER,
    default: 0
  },
  title: Sequelize.STRING
};
class Movie extends Model {}
Movie.init(classicFields, {
  sequelize: db,
  tableName: "moive"
});

class Sentence extends Model {}
Sentence.init(classicFields, {
  tableName: "sentence",
  sequelize: db
});

class Music extends Model {}
Music.init(
  Object.assign(classicFields, {
    url: Sequelize.STRING
  }),
  {
    sequelize: db,
    tableName: "music"
  }
);

module.exports = {
  Sentence,
  Movie,
  Music
};
