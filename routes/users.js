const router = require("express").Router();
const { authorize } = require("../middlewares/auth");
const {
  getCurrentUser,
  updateUser
} = require("../controllers/users");

router.get("/users/me", authorize, getCurrentUser);
router.patch("/users/me", authorize, updateUser);

/* router.delete("/:userId", deleteUser); */
module.exports = router;
