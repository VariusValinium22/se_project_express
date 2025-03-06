const { Joi, celebrate } = require("celebrate");
const router = require("express").Router();

const validator = require("validator");

const { createItem, getItems } = require("../controllers/clothingItems");
const { getCurrentUser, createUser, login } = require("../controllers/users");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.url");
};

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.hex": "Invalid Id format. Must be a 24-character hex string.",
      "string.length": "Invalid Id length. Must be exactly 24 characters.",
      "any.required": "Id is required.",
    }),
  }),
});


const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": `The minium length of the "name" field is 2`,
      "string.max": `The maximum length of the "name" field is 30`,
      "string.empty": `The "name" field must be filled in`,
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": `The "imageUrl" field must be filled in`,
      "string.uri": `The "imageUrl" field must be a valid url`,
    }),
  }),
});

router.post(
  "/items",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      image: Joi.string().required().custom(validateURL),
    }),
  }),
  createItem
);

router.post(
  "/users",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().custom(validateURL),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

router.get(
  "/users/:id",
/*   celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }), */
  validateId,
  getCurrentUser
);

router.get(
  "/items/:id",
/*   celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }), */
  validateId,
  getItems
);

module.exports = { router, validateURL, validateId, validateCardBody };
