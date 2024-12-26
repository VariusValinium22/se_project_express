const Item = require("../models/clothingItem");
const Errors = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(Errors.INTERNAL_SERVER_ERROR.code).send({ message: Errors.INTERNAL_SERVER_ERROR.message });
    });
};

/* const getItem = (req, res) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
} */

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(Errors.VALIDATION_ERROR.code).send({ message: Errors.VALIDATION_ERROR.message });
      }
      return res.status(Errors.INTERNAL_SERVER_ERROR.code).send({ message: Errors.INTERNAL_SERVER_ERROR.message });
    });
};


const deleteItem = (req,res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send({ message: "Item has been deleted", item })
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(Errors.NOT_FOUND.code).send({ message: Errors.NOT_FOUND.message });
      } if (err.name === "CastError") {
        return res.status(Errors.BAD_REQUEST.code).send({ message: Errors.BAD_REQUEST.message });
      }
      return res.status(Errors.INTERNAL_SERVER_ERROR.code).send({ message: Errors.INTERNAL_SERVER_ERROR.message });
    })
};

module.exports = { getItems, createItem, deleteItem };