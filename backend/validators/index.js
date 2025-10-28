const projectValidators = require('./project.validator');
const paymentValidators = require('./payment.validator');

module.exports = {
  ...projectValidators,
  ...paymentValidators
};

