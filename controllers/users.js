const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Errors = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
/* const { update } = require("../models/clothingItem"); */

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      /* console.log("All Users:", users); */
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(Errors.INTERNAL_SERVER_ERROR.code)
        .send({ message: Errors.INTERNAL_SERVER_ERROR.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      /* console.log("Found User:", user); */
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
  const { name, avatar, email, password } = req.body;
  console.log("Request Body:", req.body);
  if (!name || !avatar || !email || !password) {
    return res.status(400).send({
      message: "missing fields",
    });
  }

  console.log("Request Body of createUser:", req.body);
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) =>
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      })
    )
    .catch((err) => {
      console.error(err);
      console.log("Name of Error: ", err.name);
      if (err.name === "ValidationError") {
        return res
          .status(Errors.VALIDATION_ERROR.code)
          .send({ message: Errors.VALIDATION_ERROR.message });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already exists" });
      }
      return res
        .status(Errors.INTERNAL_SERVER_ERROR.code)
        .send({ message: Errors.INTERNAL_SERVER_ERROR.message });
    });
};

const updateUser = (req, res) => {
  const { userId } = req.params;
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res.status(400).send({
      message: "Name and avatar fields are required",
    });
  }

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(Errors.NOT_FOUND.code)
          .send({ message: Errors.NOT_FOUND.message });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(Errors.VALIDATION_ERROR.code)
          .send({ message: Errors.VALIDATION_ERROR.message });
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

const login = (req, res) => {
  const { email, password } = req.body;
  console.log("Request Body of login:", req.body);

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

module.exports = { getUsers, getUser, createUser, login, updateUser };
