window.onload = function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var webgl = document.getElementById('webgl');
	var ctxW = webgl.getContext('2d');
	var up = false;
	var down = false;
	var left = false;
	var right = false;

	var myImg = new Image();
	myImg.src = './img.png';

	var cam = {
		x: 200,
		y: 200,
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
		zA: cam.z-200,
		zB: cam.z-200,
		zC: cam.z-200,
		zD: cam.z-200,
		angle: 0
	}
		
	configKeyboardKeys({
		87: {press: function () {up = true}, release: function() {up = false}},
		83: {press: function () {down = true}, release: function() {down = false}},
		65: {press: function () {left = true}, release: function() {left = false}},
		68: {press: function () {right = true}, release: function() {right = false}},
	});
	
	loop();

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
			var cos = Math.cos(Math.PI/180),
				sin = Math.sin(Math.PI/180);
				ctx.translate(cam.x, cam.y);
				ctx.transform(cos, -sin, sin, cos, 0, 0);
				ctx.translate(-cam.x, -cam.y);
		}
		if(right) {
			var cos = Math.cos(Math.PI/180),
				sin = Math.sin(Math.PI/180);
				ctx.translate(cam.x, cam.y);
				ctx.transform(cos, sin, -sin, cos, 0, 0);
				ctx.translate(-cam.x, -cam.y);
		}
	}
	
	function draw() {
		cleanCanvas();
		ctx.drawImage(myImg, cam.x-myImg.width/2, cam.y-myImg.height/2);
		var points = calculatePointsPositionInZeroZ();
		drawPathIntoSquare(square);
		drawPathIntoPoints(points);
		drawPoints(points);

		var data = getImageDataFromProjection(points);
		drawInWEBGLcanvas(data);
	}

	function getImageDataFromProjection(p) {
		var data = [];
		// for(var j = p.a.y; j < p.c.y; j++) {
		// 	for(var i = p.a.x; i < p.b.x; i++) {
		// 		data.push(ctx.getImageData(i,j, 1, 1));
		// 	}
		// }
		return data;
	}

	function drawInWEBGLcanvas(data) {
		// for(var j = 0; j < webgl.height; j++) {
		// 	for(var i = 0; i < webgl.width; i++) {
		// 		ctxW.putImageData(data[i] , i, j);
		// 	}
		// }
	}

	function cleanCanvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctxW.clearRect(0, 0, canvas.width, canvas.height)
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
}