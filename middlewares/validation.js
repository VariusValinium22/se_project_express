const { Joi, celebrate } = require('celebrate');
const router = require("express").Router();

const validator = require('validator');
const { createItem, getItems } = require('../controllers/clothingItems');
const { getCurrentUser, createUser } = require('../controllers/users');

router.post('/items', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    image: Joi.string().required().url()
  }),
}), createItem);

router.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().url(),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
}), login);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
}), getCurrentUser);

router.get('/items/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required()
  })
}), getItems);

module.exports = router;
