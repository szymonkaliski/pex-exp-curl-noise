var Vec3 = require("pex-geom").Vec3;

function Particle(pos, field) {
  this.startPos = pos;
  this.field    = field;

  this.valueScale = 0.3;
  this.steerScale = 0.02;

  this.reset();
}

Particle.prototype.reset = function() {
  this.pos      = this.startPos.dup();
  this.velocity = new Vec3();
};

Particle.prototype.update = function() {
  var value = this.field.get(this.pos.x, this.pos.y, this.pos.z);

  if (value) {
    value = value.vec.dup().normalize().scale(this.valueScale);

    var steer = new Vec3().asSub(value, this.velocity).normalize().scale(this.steerScale);

    this.velocity.add(steer);
    this.pos.add(this.velocity);
  }
  else {
    this.reset();
  }
};

Particle.prototype.getPos = function() {
  return this.pos;
};

module.exports = Particle;
