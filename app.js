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

  this.distance = function(p) {
    var squareDiffX = Math.pow(this.x - p.x, 2);
    var squareDiffY = Math.pow(this.y - p.y, 2);
    var squareDiffZ = Math.pow(this.z - p.z, 2);

    return Math.sqrt(squareDiffX + squareDiffY + squareDiffZ);
  };
}

function Vector(origin, direction) {
  this.origin = origin;
  this.direction = direction;
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
  };

  this.tomIsIntersecting = function(vector) {

    var v1 = vector.direction;
    var v2 = vector.origin;

    var x1 = v1.x;
    var y1 = v1.y;
    var z1 = v1.z;
    var x2 = v2.x;
    var y2 = v2.y;
    var z2 = v2.z;

    var x3 = this.center.x;
    var y3 = this.center.y;
    var z3 = this.center.z;
    var r = this.radius;

    var a = Math.pow(x2 - x1, 2) + Math.pow((y2 - y1), 2) + Math.pow((z2 - z1), 2);
    var b = 2*((x2 - x1)*(x1 - x3) + (y2 - y1)*(y1 - y3) + (z2 - z1)*(z1 - z3) );
    var c = Math.pow(x3, 2) + Math.pow(y3, 2) + Math.pow(z3, 2) + Math.pow(x1, 2) + Math.pow(y1, 2) + Math.pow(z1, 2) - 2*(x3*x1 + y3*y1 + z3*z1) - Math.pow(r, 2);
    var radicand = Math.pow(b, 2) - 4*a*c;

    function xyz_from_u(u) {
      return [x1 + u * (x2 - x1), y1 + u * (y2 - y1), z1 + u * (z2 - z1)];
    }

    if (radicand < 0){
      return false;
    } else if (radicand === 0){
      return true;
    } else if (radicand > 0) {
      return true;
    } else {
      throw "logic error!";
    }
  };

}

var createCamera = function(width) {
  var camera = [];

  for (var i = 0; i < width; i++) {
    camera[i] = [];
    for (var j = 0; j < width; j++) {
      var origin = new Point(0, 0, 0);
      var direction = new Point(i-250, j-250, 499);
      camera[i][j] = new Vector(origin, direction);
    }
  }
  return camera;
};

var camera = createCamera(500);
var objects = [];
//objects.push(new Sphere(new Point(0, 0, 1000), 100));
objects.push(new Sphere(new Point(100, 50, 1000), 10));
objects.push(new Sphere(new Point(100, 150, 1000), 10));
objects.push(new Sphere(new Point(250, 50, 1000), 10));
objects.push(new Sphere(new Point(250, 150, 1000), 10));
//objects.push(new Sphere(new Point(100, 100, 500), 10));
var canvas = document.getElementById("canvas").getContext('2d');

for (var x = 0; x < camera.length; x++) {
  for (var y = 0; y < camera.length; y++) {
    for (var i = 0; i < objects.length; i++) {
      if (objects[i].tomIsIntersecting(camera[x][y])) {
        canvas.fillRect(camera[x][y].direction.x, camera[x][y].direction.y,
        (camera[x][y].direction.x)+1, (camera[x][y].direction.y)+1);
      }
    }
  }
}
