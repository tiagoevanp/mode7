var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var up = false;
var down = false;
var left = false;
var right = false;
var data;
var matrix;

var myImg = new Image();
myImg.src = './img2.png';

var cam = {
	x: 200,
	y: 300,
	z: 500
}

var square = {
	xA: cam.x-50,
	xB: cam.x+50,
	xC: cam.x+50,
	xD: cam.x-50,
	yA: cam.y-50,
	yB: cam.y-50,
	yC: cam.y+50,
	yD: cam.y+50,
	zA: cam.z-300,
	zB: cam.z-300,
	zC: cam.z-300,
	zD: cam.z-300,
	angle: 0.01
}
	
configKeyboardKeys({
	87: {press: function () {up = true}, release: function() {up = false}},
	83: {press: function () {down = true}, release: function() {down = false}},
	65: {press: function () {left = true}, release: function() {left = false}},
	68: {press: function () {right = true}, release: function() {right = false}},
});

function configKeyboardKeys(keys) {
	document.addEventListener('keydown', handlerKeyDown, false);
	document.addEventListener('keyup', handlerKeyUp, false);
	
	function handlerKeyDown(evt) {
		if(evt.keyCode in keys) {
			keys[evt.keyCode].press();
		}
	}
	
	function handlerKeyUp(evt) {
		if(evt.keyCode in keys) {
			keys[evt.keyCode].release();
		}
	}
}

myImg.onload = function () {
	loop();
}

function loop() {
	update();
	draw();
	window.requestAnimationFrame(loop);
}

function update() {
	if(up) {
		square.zA++;
		square.zB++;
		square.zC--;
		square.zD--;
	}
	if(down) {
		square.zA--;
		square.zB--;
		square.zC++;
		square.zD++;
	}
	if(left) {
		rotate('left');
	}
	if(right) {
		rotate('right');
	}
}

function rotate(direction) {
	if(direction == 'left') {
		square.angle+=0.01;
	} else if(direction == 'right') {
		square.angle-=0.01;
	}
		matrix = [
			[Math.cos(square.angle), Math.sin(square.angle)],
			[-Math.sin(square.angle), Math.cos(square.angle)],
		];

	var vectors = [
		[-50, -50, ['xA', 'yA']],
		[50, -50, ['xB', 'yB']],
		[50, 50, ['xC', 'yC']],
		[-50, 50, ['xD', 'yD']],
	];
	for(var i = 0; i < vectors.length; i++) {
		multiplyMatrixWithVector(matrix, vectors[i]);
	}
}

function multiplyMatrixWithVector(matrix, vector) {
	var x = vector[0]*matrix[0][0] + vector[1]*matrix[0][1],
			y = vector[0]*matrix[1][0] + vector[1]*matrix[1][1];
	square[vector[2][0]] = x+cam.x;
	square[vector[2][1]] = y+cam.y;
}

function draw() {
	cleanCanvas();
	
	ctx.drawImage(myImg, 0, 0);
	
	var points = calculatePointsPositionInZeroZ();
	
	drawPathIntoSquare(square);
	drawPathIntoPoints(points);
	drawPoints(points);
}

function getImageDataFromProjection(p) {
	data = {a:{x:0,y:0},b:{x:0,y:0},c:{x:0,y:0},d:{x:0,y:0}};
	for(key in p) {
		data[key]['x'] = (p[key].x+100)/1800;
		data[key]['y'] = (p[key].y+100)/1800;
	}
	return data;
	
}
function cleanCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawPathIntoSquare(points) {
	ctx.strokeStyle = 'red';
	ctx.beginPath();
	ctx.moveTo(points.xA, points.yA);
	ctx.lineTo(points.xB, points.yB);
	ctx.lineTo(points.xC, points.yC);
	ctx.lineTo(points.xD, points.yD);
	ctx.closePath();
	ctx.stroke();
}

function drawPathIntoPoints(points) {
	ctx.strokeStyle = 'white';
	ctx.beginPath();
	ctx.moveTo(points.a.x, points.a.y);
	ctx.lineTo(points.b.x, points.b.y);
	ctx.lineTo(points.c.x, points.c.y);
	ctx.lineTo(points.d.x, points.d.y);
	ctx.closePath();
	ctx.stroke();
}

function drawPoints(points) {
	ctx.fillStyle = 'green';
	createPoint(points.a.x, points.a.y);
	createPoint(points.b.x, points.b.y);
	createPoint(points.c.x, points.c.y);
	createPoint(points.d.x, points.d.y);
	ctx.fillStyle = 'red';
	createPoint(square.xA, square.yA);
	createPoint(square.xB, square.yB);
	createPoint(square.xC, square.yC);
	createPoint(square.xD, square.yD);
	ctx.fillStyle = 'blue';
	createPoint(cam.x, cam.y);
}

function calculatePointsPositionInZeroZ() {
	var lambda = cam.z/(cam.z-square.zA);
	var pointA = {
		x: lambda*(square.xA-cam.x)+cam.x,
		y: lambda*(square.yA-cam.y)+cam.y,
		z: 0
	}
	
	lambda = -cam.z/(square.zB-cam.z);
	var pointB = {
		x: lambda*(square.xB-cam.x)+cam.x,
		y: lambda*(square.yB-cam.y)+cam.y,
		z: 0
	}
	
	lambda = -cam.z/(square.zC-cam.z);
	var pointC = {
		x: lambda*(square.xC-cam.x)+cam.x,
		y: lambda*(square.yC-cam.y)+cam.y,
		z: 0
	}
	
	lambda = -cam.z/(square.zD-cam.z);
	var pointD = {
		x: lambda*(square.xD-cam.x)+cam.x,
		y: lambda*(square.yD-cam.y)+cam.y,
		z: 0
	}
	return {
		a: pointA, 
		b: pointB, 
		c: pointC, 
		d: pointD
	};
}

function createPoint(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, 3, 0, Math.PI*2);
	ctx.fill();
}