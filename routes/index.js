const router = require("express").Router();
const Errors = require("../utils/errors");
const { authorize } = require("../middlewares/auth");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, updateUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", authorize, userRouter);
router.patch("/me", updateUser);
router.use("/items", itemRouter);

// catch-all for non-existent resources
router.use((req, res) =>
  res.status(Errors.NOT_FOUND.code).send({ message: Errors.NOT_FOUND.message })
);

module.exports = router;
