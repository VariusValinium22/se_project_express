const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      /* console.log("All Users:", users); */
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const getUser  = (req, res) => {
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
        return res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
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
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteUser = (req,res) => {
  const { userId } = req.params;
  User.findByIdAndDelete(userId)
    .orFail()
    .then((user) => {
      console.log("User has been DELETED:", user);
      res.status(200).send({ message: "User has been deleted", user })
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    })
};


module.exports = { getUsers, getUser, createUser, deleteUser };
