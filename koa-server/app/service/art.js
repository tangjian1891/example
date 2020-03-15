/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-25 19:43:03
 */
const { Movie, Music, Sentence } = require("../model/classic");
const Favor = require("../model/favor");
const { Op } = require("sequelize");
const { db } = require("./../../core/db");
const { LikeError, DisLikeError } = require("../../middleware/exeception");
const Exception = require("../../middleware/exeception");
class Art {
  /**
   * 根据type和art_id获取 对应的文章 期刊数据
   * @param {*} art_id
   * @param {*} type
   */
  static async getData(art_id, type) {
    let art = null;
    const finder = {
      where: {
        id: art_id
      }
    };
    switch (type) {
      case 100:
        art = await Movie.findOne(finder);
        break;
      case 200:
        art = await Music.findOne(finder);
        break;
      case 300:
        art = await Sentence.findOne(finder);
        break;
      case 400:
        break;

      default:
        break;
    }
    return art;
  }
  /**
   * 点赞业务接口。 同时操作两张表。需要事务的支持
   * @param {*} art_id
   * @param {*} type
   * @param {*} uid
   */
  static async like(art_id, type, uid) {
    // 添加记录
    // classic中的  fav_nums
    // 上述两者会出现不一致的情况。 所以需要 数据库事务 保证数据一致性 ACID
    //1.点赞。 查找该用户 是否为该条期刊点赞
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    });
    if (favor) {
      throw new LikeError("已经点赞过了，还瞎点个啥");
    }
    // 2.没有点赞过。操作两张表，开启事务
    db.transaction(async t => {
      // 创建用户对应 点赞 模型 的数据
      await Favor.create(
        {
          art_id,
          type,
          uid
        },
        { transaction: t }
      );
      // 在期刊的  目标的对象。进行fav_nums+1
      let art = await Art.getData(art_id, type);
      // 获取的模型对象中有增加的方法
      await art.increment("fav_nums", { by: 1, transaction: t });
    });
  }
  static async dislike(art_id, type, uid) {
    //1. 查看点赞数据表中是否有点赞的数据
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    });
    if (!favor) {
      throw new DisLikeError("还未点赞过过，不能取消");
    }
    // 2.没有点赞过。操作两张表，开启事务
    return db.transaction(async t => {
      // 删除对应的点赞信息，软删除
      await favor.destroy(
        {
          force: true
        },
        { transaction: t }
      );
      // 在期刊的  目标的对象。进行fav_nums+1
      let art = await Art.getData(art_id, type);
      // 获取的模型对象中有减一的方法
      await art.decrement("fav_nums", { by: 1, transaction: t });
    });
  }
  /**
   * 查看用户是否喜欢这篇 art期刊
   * @param {number} art_id
   * @param {number} type
   * @param {number} uid
   */
  static async userLikeIt(art_id, type, uid) {
    let result = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    });
    return result ? true : false;
  }
  /**
   *  获取我喜欢的  期刊
   */
  static async getMyClassicFavors(uid) {
    // 期刊中是没有书籍的。所以不需要书籍，排除400
    let favs = await Favor.findAll({
      where: {
        uid,
        type: {
          [Op.not]: 400
        }
      }
    });
    if (!favs) {
      throw new Exception.NotFoundException("没有找到数据");
    }
    return await Art.getList(favs);
    //
  }
  static async getList(favInfoList) {
    // favInfoList 三种类型  三次硬查询
    const favInfoObj = {
      100: [],
      200: [],
      300: []
    };
    let arts = [];
    for (const artInfo of favInfoList) {
      favInfoObj[artInfo.type].push(artInfo.art_id);
    }
    for (const key in favInfoObj) {
      if (favInfoObj[key].length === 0) {
        continue;
      }
      let art = await Art._getListByType(favInfoObj[key], parseInt(key));
      // console.log(Object.prototype.toString.call(art.dataValues));
      // console.log(art);
      arts.push(...art);
    }
    return arts;
  }
  /**
   * 根据ids的数组和type 查询对应的art
   * @param {*} ids
   * @param {*} type
   */
  static async _getListByType(ids, type) {
    let arts = null;
    const finder = {
      where: {
        id: {
          [Op.in]: ids
        }
      }
    };
    switch (type) {
      case 100:
        arts = await Movie.findAll(finder);
        break;
      case 200:
        arts = await Music.findAll(finder);
        break;
      case 300:
        arts = await Sentence.findAll(finder);
        break;
      case 400:
        break;

      default:
        break;
    }
    return arts;
  }
}

module.exports = {
  Art
};
