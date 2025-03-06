import { NODE_ENV } from "../config/config.js";

const errorHandler = (err, req, res, next) => {
  NODE_ENV !== "production" && console.error(err.stack);

  res.status(err.statusCode || 500).json({
    errors: err.errors && err.errors.length > 0 ? err.errors : [err.message],
  });
};

export default errorHandler;