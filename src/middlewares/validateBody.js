import createError from 'http-errors';
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createError(400, error.message));
    }
    next();
  };
};
export default validateBody;
