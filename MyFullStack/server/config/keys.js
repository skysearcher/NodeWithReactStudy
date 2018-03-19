//key.js find what keys to return
if (process.env.NODE_ENV === 'production') {
  // we are in prod
  module.exports = require('./prod');
} else {
  //return dev keys
  module.exports = require('./dev');
}