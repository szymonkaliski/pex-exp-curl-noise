var Arcball   = require("pex-glu").Arcball;
var Camera    = require("pex-glu").PerspectiveCamera;
var Color     = require("pex-color").Color;
var Glu       = require("pex-glu");
var Materials = require("pex-materials");
var Mesh      = require("pex-glu").Mesh;
var Geometry  = require("pex-geom").Geometry;
var Platform  = require("pex-sys").Platform;
var Random    = require("pex-random");
var Window    = require("pex-sys").Window;
var GUI       = require("pex-gui").GUI;

var FlowField = require("./flow-field");
var Particle  = require("./particle");
var times     = require("./utils").times;

Window.create({
  settings: {
    width:      1280,
    height:     720,
    type:       "3d",
    fullscreen: Platform.isBrowser
  },

  init: function() {
    this.fieldSize   = 50;
    this.particleNum = Platform.isBrowser ? 40000 : 10000;

    this.initField();
    this.initParticles();

    this.camera  = new Camera(60, this.width / this.height);
    this.arcball = new Arcball(this, this.camera, 20);

    this.gui = new GUI(this);
    this.gui.addParam("field size",          this, "fieldSize",   { min: 10, max: 100 });
    this.gui.addParam("particle count",      this, "particleNum", { min: 1000, max: 60000 });
    this.gui.addButton("recreate field",     this, "initField");
    this.gui.addButton("recreate particles", this, "initParticles");
  },

  initField: function() {
    this.field = new FlowField(this.fieldSize);
    this.field.calculate();
  },

  initParticles: function() {
    var vertices   = [];
    this.particles = [];

    times(this.particleNum).map(function() {
      var pos = Random.vec3();

      vertices.push(pos.dup());
      this.particles.push(new Particle(pos.dup(), this.field));
    }.bind(this));

    var material = new Materials.SolidColor({ pointSize: 1 });
    var geometry = new Geometry({ vertices: vertices });
    this.mesh    = new Mesh(geometry, material, { points: true });
  },

  resetParticles: function() {
    this.particles.forEach(function(particle) { particle.reset(); });
  },

  draw: function() {
    Glu.clearColor(Color.Black);

    this.particles.forEach(function(particle, i) {
      particle.update();
      this.mesh.geometry.vertices[i].setVec3(particle.getPos());
    }.bind(this));

    this.mesh.geometry.vertices.dirty = true;

    this.mesh.draw(this.camera);
    this.gui.draw();
  }
});
