const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/not-found-error");
const BadRequestError = require("../utils/errors/bad-request-error");
const ConflictError = require("../utils/errors/conflict-error");
const UnauthorizedError = require("../utils/errors/unauthorized-error");

const getCurrentUser = (req, res, next) => {
  const userId = req.user?._id;
  return User.findById(userId)
    .orFail()
    .select("-password")
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User was not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid User"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    next(new BadRequestError("Input is not valid"));
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("Conflicting Error");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      if (!hashedPassword) return null;

      return User.create({ name, avatar, email, password: hashedPassword });
    })
    .then((user) => {
      if (user) {
        const userObject = user.toObject();
        delete userObject.password;
        res.status(201).send(userObject);
      }
    })
    .catch((err) => {
      console.error("Error occurred in Add User request:", err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("User is not validated"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    next(new BadRequestError("Invalid name or avatar"));
  }

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .select("-password")
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new NotFoundError("User is not validated"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid User"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Input is not valid"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("User is unauthorized"));
      } else {
        next(err);
      }
    });
};

module.exports = { getCurrentUser, createUser, login, updateUser };
