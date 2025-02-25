module.exports = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500; // Default to 500 if no status is set
  const message = err.message || "An error occurred on the server";

  res.status(statusCode).send({ message });
};
