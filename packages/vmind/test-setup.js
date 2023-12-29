require('dotenv').config({ path: './.env.local' });
const { error, log,warn,info,debug } = require('console');

global.console = {
  // eslint-disable-next-line no-undef
  //log: jest.fn(), // console.log are ignored in tests
  log: log,

  // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};
