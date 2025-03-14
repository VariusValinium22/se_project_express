const Item = require("../models/clothingItem");
const NotFoundError = require("../utils/errors/not-found-error");
const BadRequestError = require("../utils/errors/bad-request-error");
const ForbiddenError = require("../utils/errors/forbidden-error");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const getItemsById = (req, res, next) => {
  Item.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  console.log(req.user);

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Item is not validated"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return next(new ForbiddenError("Item not found"));
      }

      return Item.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deletedItem) {
          next(new NotFoundError("Item not found Boogies"));
        }
        return res
          .status(200)
          .send({ message: "Item has been deleted", deleteItem });
      });
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item was not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
       } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item was not found to like"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid User"));
      } else {

        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item was not found to dislike"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Item"));
      } else {
        next(err);
      }
    });
};

module.exports = { getItems, getItemsById, createItem, deleteItem, likeItem, dislikeItem };
