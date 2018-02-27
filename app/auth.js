const middle = require('../configuration/authentication');
const validateObj = require('../configuration/validateform');

module.exports = function(express) {
  const router = new express.Router();
  router.post('/signup', (req, res, next) => {
    const validationResult = validateObj.validateSignupForm(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }

    return middle.signup(req.body, res, next);
  });

  router.post('/login', (req, res, next) => {
    const validationResult = validateObj.validateLoginForm(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }

    return middle.login(req.body, res, next);
  });

  return router;
};
