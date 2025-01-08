const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const Errors = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

/* const { update } = require("../models/clothingItem"); */

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(Errors.INTERNAL_SERVER_ERROR.code)
        .send({ message: Errors.INTERNAL_SERVER_ERROR.message });
    });
};

const getCurrentUser = (req, res) => {
  console.log("req.user:", req.user);
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).send({ message: Errors.AUTHORIZATION_ERROR.message });
  }
  console.log(userId);
  return User.findById(userId)
    .orFail()
    .select('-password')
    .then((user) => {
      console.log("user Found: ", user);
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(Errors.NOT_FOUND.code)
          .send({ message: Errors.NOT_FOUND.message });

      }
      if (err.name === "CastError") {
        return res
          .status(Errors.BAD_REQUEST.code)
          .send({ message: Errors.BAD_REQUEST.message });

      }
      return res
        .status(Errors.INTERNAL_SERVER_ERROR.code)
        .send({ message: Errors.INTERNAL_SERVER_ERROR.message });

    });
};

const createUser = (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!name || !avatar || !email || !password) {
      res.status(400).send({ message: "missing fields" });
      return;
    }

    if (name.length < 2 || name.length > 30) {
      const message =
        name.length < 2
          ? "Name must be at least 2 characters"
          : "Name must be less than 30 characters";
      res.status(400).send({ message });
      return;
    }

    if (!validator.isURL(avatar)) {
      res.status(400).send({ message: "Invalid URL in avatar field" });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).send({ message: "Invalid email address" });
      return;
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
          res
            .status(Errors.VALIDATION_ERROR.code)
            .send({ message: Errors.VALIDATION_ERROR.message });
          return;
        }

        if (err.code === 11000) {
          res.status(409).send({ message: "Email already exists" });
          return;
        }

        res
          .status(Errors.INTERNAL_SERVER_ERROR.code)
          .send({ message: Errors.INTERNAL_SERVER_ERROR.message });
      });
  } catch (err) {
    console.error("Unexpected error:", err);
    res
      .status(Errors.INTERNAL_SERVER_ERROR.code)
      .send({ message: Errors.INTERNAL_SERVER_ERROR.message });
  }
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  console.log("Updating user with ID: ", userId);
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    res.status(400).send({
      message: "Name and avatar fields are required",
    });
    return;
  }

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .select('-password')
    .then((user) => {
      if (!user) {
        res
          .status(Errors.NOT_FOUND.code)
          .send({ message: Errors.NOT_FOUND.message });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(Errors.VALIDATION_ERROR.code)
          .send({ message: Errors.VALIDATION_ERROR.message });
        return;
      }
      if (err.name === "CastError") {
        res
          .status(Errors.BAD_REQUEST.code)
          .send({ message: Errors.BAD_REQUEST.message });
        return;
      }
      res
        .status(Errors.INTERNAL_SERVER_ERROR.code)
        .send({ message: Errors.INTERNAL_SERVER_ERROR.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = { getUsers, getCurrentUser, createUser, login, updateUser };
