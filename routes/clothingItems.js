const router = require("express").Router();
const { getItems, getItem, createItem, deleteItem } = require("../controllers/clothingItems");

router.get("/", getItems);
router.get("/:itemId", getItem);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
