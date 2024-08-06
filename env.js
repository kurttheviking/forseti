const has = require('has');

const config = {
  CEREBRAS_API_KEY: process.env.FSTI__CEREBRAS_API_KEY
};

function get(param) {
  if (!has(config, param)) {
    throw new Error(`unknown configuration parameter: ${param}`);
  }

  return config[param];
}

module.exports = { get };