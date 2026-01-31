const router = require("express").Router();
const { authorize } = require("../middlewares/auth");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../utils/errors/not-found-error");
const { validateUserSignup, validateUserSignin } = require("../middlewares/validation");

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

router.post("/signup", validateUserSignup, createUser);
router.post("/signin", validateUserSignin, login);

// POST /users route for Project 12 test compatibility (same as /signup)
router.post("/users", validateUserSignup, createUser);

router.use("/users", authorize, userRouter);
router.use("/items", itemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
