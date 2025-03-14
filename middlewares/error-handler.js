module.exports = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "An error occurred on the server";

  res.status(statusCode).send({ message });
  next();
};
