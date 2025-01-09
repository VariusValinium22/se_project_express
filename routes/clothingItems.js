const router = require("express").Router();
const { authorize } = require("../middlewares/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem
} = require("../controllers/clothingItems");

router.get("/", getItems);
/* router.get("/:itemId", getItem); */
router.post("/", authorize, createItem);
router.delete("/:itemId", authorize, deleteItem);

router.put("/:itemId/likes", authorize, likeItem);
router.delete("/:itemId/likes", authorize, dislikeItem);

module.exports = router;
