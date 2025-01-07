const Item = require("../models/clothingItem");
const Errors = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(Errors.INTERNAL_SERVER_ERROR.code)
        .send({ message: Errors.INTERNAL_SERVER_ERROR.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user?._id;

  console.log("Delete request recieved for Item Id", itemId );
  console.log("Logged in User ID", userId );

  if (!itemId) {
    console.log("Item ID is missing in the request");
    res
      .status(400)
      .send({ message: "Item ID is required in the request parameters"});
      return;
  }

  if (!userId) {
    console.log("User ID is missing or invalid in the request");
    res
      .status(403)
      .send({ message: "Unauthorized. User ID is missing or invalid" });
      return;
  }

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      console.log("Item found:", item);
      if (item.owner.equals(userId)) {
        console.log("Forbidden: User does not own this item");
        return res
          .status(403)
          .send({ message: Errors.FORBIDDEN_ERROR.message });
      }
      console.log("Authorized to delete item:", itemId);
      return Item.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      if (!deletedItem) {
        console.log("Item not found or already deleted");
        return res
        .status(404)
        .send({ message: "Item not found or could not be deleted." });
      }
      console.log("Item deleted successfully:", deletedItem);
      return res.status(200).send({ message: "Item has been deleted", deleteItem });
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

module.exports = { getItems, createItem, deleteItem };
