/*
 * @Description:文章期刊模块
 * @Author: TangJian
 * @Date: 2020-02-25 16:05:33
 */
const Router = require("@koa/router");
const Exeception = require("../../../middleware/exeception");
const { verifyToken, verifyToken2 } = require("../../../core/auth");
const Flow = require("../../model/flow");
const { Art } = require("../../service/art");
const { favorValidator } = require("../../../core/validator");
const router = new Router({
  prefix: "/v1/classic"
});
// 最近的文章
router.get("/latest", async ctx => {
  // 验证一手Token
  const isAccess = verifyToken(ctx);
  if (!isAccess) {
    throw new AuthFailed("token过期或不合法，请重新登录");
  }
  const flow = await Flow.findOne({
    order: [["index", "DESC"]]
  });
  // 需要序列化这个art，把某一种语言转换成json  dataValues
  const art = await Art.getData(flow.art_id, flow.type);
  // ctx.body = flow;
  // art.dataValues= index = flow.index;
  art.setDataValue("index", flow.index);
  throw new Success(art);
});
/**
 * 获取这个用户是否点赞过 。以及总期刊点赞数  局部刷新接口
 */
router.get("/:type/:id/favor", verifyToken2, async ctx => {
  const value = favorValidator(ctx);
  const { id, type } = value;
  const art = await Art.getData(id, type);
  if (!art) {
    throw new Exeception.NotFoundException("没有找到这篇期刊");
  }
  const isLike = await Art.userLikeIt(id, type, ctx.auth.uid);
  throw new Exeception.Success({
    fav_nums: art.fav_nums,
    like_status: isLike
  });
});
/**
 * 查看用户的点赞的所有文章
 */
router.get("/favor", verifyToken2, async ctx => {
  // search会有分页
  const uid = ctx.auth.uid;
  let favorAllList = await Art.getMyClassicFavors(uid);
  throw new Exeception.Success(favorAllList);
});

/**
 * 总的页面接口
 * 根据 type类型 和 id获取对应文章的信息 。
 */
router.get("/:type/:id", verifyToken2, async ctx => {
  // 校验type 和id
  const value = favorValidator(ctx);
  const art = await Art.getData(value["art_id"], value["type"]);
  if (!Art) {
    throw new Exeception.NotFoundException("没有找到这篇期刊");
  }
  // 是否喜欢这篇文章
  const isLike = await Art.userLikeIt(id, type, ctx.auth.uid);
  art.setDataValue("like_status", isLike);
  throw Exeception.Success(art);
});
module.exports = router;
