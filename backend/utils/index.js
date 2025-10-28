const response = require('./response');
const errors = require('./error');

module.exports = {
  ...response,
  ...errors
};

