const router = require("express").Router();
const { authorize } = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");
const { likeItem, dislikeItem } = require("../controllers/likes");

router.get("/", getItems);
/* router.get("/:itemId", getItem); */
router.post("/", authorize, createItem);
router.delete("/:itemId", authorize, deleteItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
