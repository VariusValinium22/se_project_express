module.exports = {
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
    type: "Generic",
  },
  VALIDATION_ERROR: {
    code: 400,
    message: "Validation failed",
    type: "Validation",
  },
  AUTHORIZATION_ERROR: {
    code: 401,
    message: "Authorization required",
    type: "Authorization",
  },
  FORBIDDEN_ERROR: {
    code: 403,
    message: "You are not authorized to delete this item",
    type: "Permission",
  },
  NOT_FOUND: {
    code: 404,
    message: "Resource not found",
    type: "Resource",
  },
  CONFLICT: {
    code: 409,
    message: "Email already exists",
    type: "Duplicate",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "Internal server error",
    type: "Server",
  },
};
