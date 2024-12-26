module.exports = {
  BAD_REQUEST: { code: 400, message: "Bad Request", type: "Generic" },
  VALIDATION_ERROR: { code: 400, message: "Validation failed", type: "Validation" },
  NOT_FOUND: { code: 404, message: "Resource not found", type: "Resource" },
  INTERNAL_SERVER_ERROR: { code: 500, message: "Internal server error", type: "Server" },
};
