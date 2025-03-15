const router = require("express").Router();
const { authorize } = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

const {
  getItems,
  getItemsById,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.get("/:itemId", validateId, getItemsById);
router.post("/", authorize, validateCardBody, createItem);
router.delete("/:itemId", authorize, validateId, deleteItem);

router.put("/:itemId/likes", authorize, validateId, likeItem);
router.delete("/:itemId/likes", authorize, validateId, dislikeItem);

module.exports = router;
