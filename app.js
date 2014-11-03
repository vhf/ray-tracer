"use strict";

function Point(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.minus = function(p) {
    return new Point(
      this.x - p.x,
      this.y - p.y,
      this.z - p.z
    );
  };

  this.times = function(value) {
    return new Point(
      this.x * value,
      this.y * value,
      this.z * value
    );
  };
}

function Vector(camera, pixel) {
  this.origin = camera;
  this.direction = pixel.minus(camera);
}

function Sphere(center, radius) {
  this.center = center;
  this.radius = radius;

  this.isIntersecting = function(vector) {
    var i = vector.direction.x - vector.origin.x;
    var j = vector.direction.y - vector.origin.y;
    var k = vector.direction.z - vector.origin.z;

    var a = Math.pow(i, 2) + Math.pow(j, 2) + Math.pow(k, 2);

    var b = 2 * i * (vector.origin.x - this.center.x);
       b += 2 * j * (vector.origin.y - this.center.y);
       b += 2 * k * (vector.origin.z - this.center.z);

    var c = Math.pow(this.center.x, 2) + Math.pow(this.center.y, 2) + Math.pow(this.center.z, 2);
       c += Math.pow(vector.origin.x, 2) + Math.pow(vector.origin.y, 2) + Math.pow(vector.origin.z, 2);
       c += 2 * (-1 * this.center.x * vector.origin.x - this.center.y * vector.origin.y - this.center.z * vector.origin.z);
       c -= Math.pow(this.radius, 2);

    var delta = Math.sqrt(Math.pow(b, 2) - (4 * a * c));

    if (isNaN(delta)) {
      return false;
    }

    var val1 = (-b + delta) / (2 * a);
    var val2 = (-b - delta) / (2 * a);

    if (val1 > 0 || val2 > 0) {
      return true;
    }

    return false;

  };
}

var createCamera = function(width) {
  var camera = [];
  var gridDistance = 1000000;

  for (var i = 0; i < width; i++) {
    camera[i] = [];
    for (var j = 0; j < width; j++) {
      var origin = new Point(width/2, width/2, 0);
      var direction = new Point(i, j, gridDistance);
      camera[i][j] = new Vector(origin, direction);
    }
  }
  return camera;
};

var camera = createCamera(500);
var sphere = new Sphere(new Point(50, 50, 1000050), 50);
var canvas = document.getElementById("canvas").getContext('2d');

for (var x = 0; x < camera.length; x++) {
  for (var y = 0; y < camera.length; y++) {
    if (sphere.isIntersecting(camera[x][y])) {
      var x = camera[x][y].direction.x;
      var y = camera[x][y].direction.y;
      canvas.fillRect(x,   100 - y,
                      x+1, 100 - (y+1));
    }
  }
}
