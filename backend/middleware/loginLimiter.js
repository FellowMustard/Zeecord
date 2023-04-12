const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, //1 minute
  max: 5,
  message: {
    message: "Too Many Login Attempts, Please Try Again Later in 1 Minute!",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = loginLimiter;
