/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-25 22:35:48
 */
const Router = require("@koa/router");
const { Success, AuthFailed } = require("../../../middleware/exeception");
const { verifyToken2 } = require("../../../core/auth");
const Flow = require("../../model/flow");
const { Art } = require("../../service/art");
const { likeValidator } = require("../../../core/validator");
const router = new Router({
  prefix: "/v1/like"
});
router.post("/", verifyToken2, async ctx => {
  // 需要校验参数
  // art_id, type, uid
  let value = likeValidator(ctx);
  await Art.like(value["art_id"], value["type"], ctx.auth["uid"]);

  throw new Success("点赞成功");
});
router.post("/cancel", verifyToken2, async ctx => {
  // 需要校验参数
  // art_id, type, uid
  let value = likeValidator(ctx);
  await Art.dislike(value["art_id"], value["type"], ctx.auth["uid"]);
  throw new Success("取消点赞");
});

module.exports = router;
