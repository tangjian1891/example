/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-27 19:01:32
 */
const HotBook = require("../model/hot-book");
const Favor = require("../model/favor");
const { Op, Sequelize } = require("sequelize");
const util = require("util");
const axios = require("axios");
// require("../");
// const require('../../core/db');
class BookService {
  static async getAll() {
    // 书本集合。里面有基本信息
    const books = await HotBook.findAll({
      // 默认排序就是倒叙DESC
      order: ["index"]
    });
    // 拿到书籍机构，还需要点赞与否
    // 获取书籍id。用数组硬查询
    const ids = [];
    books.forEach(book => {
      ids.push(book.id);
    });
    // Op.in  硬查询
    //  查询 点赞的数量。
    const favors = await Favor.findAll({
      where: {
        art_id: {
          [Op.in]: ids
        },
        type: 400
      },
      group: ["art_id"],
      attributes: ["art_id", [Sequelize.fn("COUNT", "*"), "count"]]
    });
    books.forEach(book => {
      BookService._getEachBookStatus(book, favors);
    });
    return books;
  }
  static _getEachBookStatus(book, favors) {
    let count = 0;
    // 可以优化，用forEach浪费
    favors.forEach(favor => {
      if (book.id === favor.art_id) {
        count = favor.get("count");
      }
    });
    book.setDataValue("count", count);
    return book;
  }
  /**
   * 获取书籍的详细信息
   */
  static async getDetail(id) {
    //  art_id
    // const url = util.format(global.config.book.bookUrl, type);
    //获取书籍的详细信息。只能从 自己 喜欢的书籍中查询。
    // const detail = await axios.get(url);
    return detail;
  }
}
module.exports = BookService;
