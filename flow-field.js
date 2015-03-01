var Perlin     = require("perlin-simplex");
var SeedRandom = require("seedrandom");
var Vec3       = require("pex-geom").Vec3;

var times = require("./utils").times;
var clamp = require("./utils").clamp;

function FlowField(fieldSize) {
  this.fieldSize = fieldSize;
  this.field = [];
}

FlowField.prototype.computeCurl = function(x, y, z) {
  var eps = 1.0;
  var n1, n2, a, b;
  var curl = new Vec3();

  n1 = this.noise.noise3d(x, y + eps, z);
  n2 = this.noise.noise3d(x, y - eps, z);

  a = (n1 - n2) / (2 * eps);

  n1 = this.noise.noise3d(x, y, z + eps);
  n2 = this.noise.noise3d(x, y, z - eps);

  b = (n1 - n2) / (2 * eps);

  curl.x = a - b;

  n1 = this.noise.noise3d(x, y, z + eps);
  n2 = this.noise.noise3d(x, y, z - eps);

  a = (n1 - n2)/(2 * eps);

  n1 = this.noise.noise3d(x + eps, y, z);
  n2 = this.noise.noise3d(x + eps, y, z);

  b = (n1 - n2)/(2 * eps);

  curl.y = a - b;

  n1 = this.noise.noise3d(x + eps, y, z);
  n2 = this.noise.noise3d(x - eps, y, z);

  a = (n1 - n2)/(2 * eps);

  n1 = this.noise.noise3d(x, y + eps, z);
  n2 = this.noise.noise3d(x, y - eps, z);

  b = (n1 - n2)/(2 * eps);

  curl.z = a - b;

  return curl;
};

FlowField.prototype.calculate = function() {
  SeedRandom(new Date().getTime(), { global: true, entropy: true });
  this.noise = new Perlin();

  this.field = times(this.fieldSize).map(function(x) {
    return times(this.fieldSize).map(function(y) {
      return times(this.fieldSize).map(function(z) {
        var pos = new Vec3(
          x - this.fieldSize / 2,
          y - this.fieldSize / 2,
          z - this.fieldSize / 2
        );

        var mod = 0.2;
        var vector = this.computeCurl(x * mod, y * mod, z * mod);

        return { pos: pos, vec: vector };
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

FlowField.prototype.get = function(x, y, z) {
  x += this.fieldSize / 2;
  y += this.fieldSize / 2;
  z += this.fieldSize / 2;

  x = Math.round(x);
  y = Math.round(y);
  z = Math.round(z);

  return this.field[x] && this.field[x][y] && this.field[x][y][z] ? this.field[x][y][z] : undefined;
};

module.exports = FlowField;

