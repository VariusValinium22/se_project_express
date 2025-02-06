const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const Errors = require("../utils/errors");

const authorize = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(Errors.AUTHORIZATION_ERROR.code)
      .send({ message: Errors.AUTHORIZATION_ERROR.message });
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res
      .status(Errors.AUTHORIZATION_ERROR.code)
      .send({ message: Errors.AUTHORIZATION_ERROR.message });
  }
};

module.exports = { authorize };









