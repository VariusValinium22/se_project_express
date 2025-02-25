const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/not-found-error");
const BadRequestError = require("../utils/errors/bad-request-error");
const ConflictError = require("../utils/errors/conflict-error");
const UnauthorizedError = require("../utils/errors/unauthorized-error");

/* const { update } = require("../models/clothingItem"); */

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
  try {
    const { name, avatar, email, password } = req.body;

    if (!name || !avatar || !email || !password) {
      /*       res
        .status(Errors.BAD_REQUEST.code)
        .send({ message: Errors.BAD_REQUEST.message });
      return; */
      next(new BadRequestError("Input is not valid"));
    }

    if (!validator.isURL(avatar)) {
      /*       res
        .status(Errors.VALIDATION_ERROR.code)
        .send({ message: Errors.VALIDATION_ERROR.message });
      return; */
      next(new BadRequestError("Avatar Input is not valid"));
    }

    if (!validator.isEmail(email)) {
      /*       res
        .status(Errors.VALIDATION_ERROR.code)
        .send({ message: Errors.VALIDATION_ERROR.message });
      return; */
      next(new BadRequestError("Email Input is not valid"));
    }

    User.findOne({ email })
      .then((existingUser) => {
        if (existingUser) {
          const error = new Error("Email already exists");
          error.code = 11000;
          throw error;
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
          /*           res
            .status(Errors.VALIDATION_ERROR.code)
            .send({ message: Errors.VALIDATION_ERROR.message });
          return; */
          next(new BadRequestError("User is not validated"));
        }

        if (err.code === 11000) {
          /*           res
            .status(Errors.CONFLICT.code)
            .send({ message: Errors.CONFLICT.message });
          return; */
          next(new ConflictError("Conflicting Error"));
        } else {
          /*         res
          .status(Errors.INTERNAL_SERVER_ERROR.code)
          .send({ message: Errors.INTERNAL_SERVER_ERROR.message }); */
          next(err);
        }
      });
  } catch (err) {
    console.error("Unexpected error:", err);
    /*     res
      .status(Errors.INTERNAL_SERVER_ERROR.code)
      .send({ message: Errors.INTERNAL_SERVER_ERROR.message }); */
    next(err);
  }
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  if (!name || !avatar) {
/*     res.status(Errors.BAD_REQUEST.code).send({
      message: Errors.BAD_REQUEST.message,
    });
    return; */
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
/*         res
          .status(Errors.NOT_FOUND.code)
          .send({ message: Errors.NOT_FOUND.message });
        return; */
        next(new NotFoundError("User not found"));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        /*         res
          .status(Errors.VALIDATION_ERROR.code)
          .send({ message: Errors.VALIDATION_ERROR.message });
        return; */
        next(new NotFoundError("User is not validated"));
      }
      if (err.name === "CastError") {
        /*         res
          .status(Errors.BAD_REQUEST.code)
          .send({ message: Errors.BAD_REQUEST.message });
        return; */
        next(new BadRequestError("Invalid User"));
      } else {
        /*       res
        .status(Errors.INTERNAL_SERVER_ERROR.code)
        .send({ message: Errors.INTERNAL_SERVER_ERROR.message }); */
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
/*     return res
      .status(Errors.BAD_REQUEST.code)
      .send({ message: Errors.BAD_REQUEST.message }); */
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
        /*         return res
          .status(Errors.AUTHORIZATION_ERROR.code)
          .send({ message: Errors.AUTHORIZATION_ERROR.message }); */
        next(new UnauthorizedError("User is unauthorized"));
      } else {
        /*       return res
        .status(Errors.INTERNAL_SERVER_ERROR.code)
        .send({ message: Errors.INTERNAL_SERVER_ERROR.message }); */
        next(err);
      }
    });
};

module.exports = { getCurrentUser, createUser, login, updateUser };
