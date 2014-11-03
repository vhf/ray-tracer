"use strict";

var minus = function(p1, p2) {
  return [
    p1[0]-p2[0],
    p1[1]-p2[1],
    p1[2]-p2[2]
  ];
};

var isIntersecting = function(center, radius, vector) {
  var i = vector.direction[0] - vector.origin[0];
  var j = vector.direction[1] - vector.origin[1];
  var k = vector.direction[2] - vector.origin[2];

  var a = Math.pow(i, 2) + Math.pow(j, 2) + Math.pow(k, 2);

  var b = 2 * i * (vector.origin[0] - center[0]);
     b += 2 * j * (vector.origin[1] - center[1]);
     b += 2 * k * (vector.origin[2] - center[2]);

  var c = Math.pow(center[0], 2) + Math.pow(center[1], 2) + Math.pow(center[2], 2);
     c += Math.pow(vector.origin[0], 2) + Math.pow(vector.origin[1], 2) + Math.pow(vector.origin[2], 2);
     c += 2 * (-1 * center[0] * vector.origin[0] - center[1] * vector.origin[1] - center[2] * vector.origin[2]);
     c -= Math.pow(radius, 2);

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

function Vector(camera, pixel) {
  this.origin = camera;
  this.direction = minus(pixel, camera);
}

function Sphere(center, radius) {
  this.center = center;
  this.radius = radius;
}

var createCamera = function(width) {
  var camera = [];
  var gridDistance = 1000000;

  for (var i = 0; i < width; i++) {
    camera[i] = [];
    for (var j = 0; j < width; j++) {
      var origin = [width/2, width/2, 0];
      var direction = [i, j, gridDistance];
      camera[i][j] = new Vector(origin, direction);
    }
  }
  return camera;
};

var camera = createCamera(30);
var sphere = new Sphere([50, 50, 1000050], 50);
var canvas = document.getElementById("canvas").getContext('2d');


for (var x = 0; x < camera.length; x++) {
  for (var y = 0; y < camera.length; y++) {
    if (isIntersecting(sphere.center, sphere.radius, camera[x][y])) {
      var x = camera[x][y].direction[0];
      var y = camera[x][y].direction[1];
      canvas.fillRect(x,   100 - y,
                      x+1, 100 - (y+1));
    }
  }
}
