const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUser } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUser, updateUser);

module.exports = router;
