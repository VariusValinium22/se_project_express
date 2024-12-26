const User = require("../models/user");
const Errors = require("../utils/errors");

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
  const { name, avatar } = req.body;
  /* console.log(req.body); */
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      console.log("Name of Error: ", err.name);
      if (err.name === "ValidationError") {
        return res
          .status(Errors.VALIDATION_ERROR.code)
          .send({ message: Errors.VALIDATION_ERROR.message });
      }
      return res
        .status(Errors.INTERNAL_SERVER_ERROR.code)
        .send({ message: Errors.INTERNAL_SERVER_ERROR.message });
    });
};

module.exports = { getUsers, getUser, createUser };
