const { JWT_SECRET = "your-secret-key" } = process.env;
console.log(process.env.JWT_SECRET)
module.exports = {
  JWT_SECRET,
};

