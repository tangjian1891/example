/*
 * @Description:
 * @Author: TangJian
 * @Date: 2020-02-27 17:15:55
 */
const Router = require("@koa/router");
const Exeception = require("../../../middleware/exeception");
const { verifyToken, verifyToken2 } = require("../../../core/auth");
const Flow = require("../../model/flow");
const { Art } = require("../../service/art");
const { favorValidator } = require("../../../core/validator");
const Joi = require("@hapi/joi");
const BookService = require("../../service/book");
const router = new Router({
  prefix: "/v1/book"
});
/**
 * 获取热门书籍
 */
router.get("/hot_list", verifyToken2, async ctx => {
  const books = await BookService.getAll();
  throw new Exeception.Success(books);
});
/**
 * 获取书籍详细信息
 */
router.get("/:id/detail", async ctx => {
  let id = Joi.number().validate(ctx.params.id);
  if (id.error) {
    throw new Exeception.ParamsException();
  }
  let book = await BookService.getDetail(id);
  throw new Exeception.Success(book);
});
/**
 * 获取书籍的分类
 */
router;

module.exports = router;
