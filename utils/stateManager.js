const state = {};

function increment(key) {
  state[key] = (state[key] || 0) + 1;
  return state[key];
}

function reset(key) {
  state[key] = 0;
}

function get(key) {
  return state[key] || 0;
}

module.exports = { increment, reset, get };