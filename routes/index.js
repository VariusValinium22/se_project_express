const router = require("express").Router();
const Errors = require("../utils/errors");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

// catch-all for non-existent resources
router.use((req, res) => res
    .status(Errors.NOT_FOUND.code)
    .send({ message: Errors.NOT_FOUND.message }));

module.exports = router;
