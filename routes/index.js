const router = require("express").Router();
const { authorize } = require("../middlewares/auth");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../utils/errors/not-found-error");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", authorize, userRouter);
router.use("/items", itemRouter);

// catch-all for non-existent resources
router.use((req, res, next) => {
  /* res.status(Errors.NOT_FOUND.code).send({ message: Errors.NOT_FOUND.message }) */
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
