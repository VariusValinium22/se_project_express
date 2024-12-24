const router = require("express").Router();
const { getUsers, getUser, createUser, deleteUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.delete("/:userId", deleteUser);

module.exports = router;
