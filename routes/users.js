const router = require("express").Router();

const { getUsers, getUserById, getCurrentUser, updateUser } = require("../controllers/users");
const { validateUser } = require("../middlewares/validation");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", validateUser, updateUser);
router.get("/:userId", getUserById);

module.exports = router;
