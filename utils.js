var times = function(num) {
  var arr = [], i = 0;

  for (i; i < num; ++i) { arr.push(i); }

  return arr;
};

var clamp = function(val, min, max) {
  return Math.max(Math.min(val, max), min);
};

module.exports = {
  times: times,
  clamp: clamp
};
