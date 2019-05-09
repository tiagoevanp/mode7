window.onload = function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var cam = {
		x: 400,
		y: 500,
		z: 40
	}
	
	var square = {
		x: cam.x-100,
		y: cam.y-150,
		z: cam.z-50,
		width: 200,
		height: 200
	}
	
	var points = calculatePointsPositionInZeroZ();
	console.log(points);
	drawPoints(points);
	
	function drawPoints(points) {
		ctx.fillStyle = 'green';
		createPoint(points.a.x, points.a.y);
		createPoint(points.b.x, points.b.y);
		createPoint(points.c.x, points.c.y);
		createPoint(points.d.x, points.d.y);
		ctx.fillStyle = 'red';
		createPoint(square.x, square.y);
		createPoint(square.x+square.width, square.y);
		createPoint(square.x+square.width, square.y+square.height);
		createPoint(square.x, square.y+square.height);
		ctx.fillStyle = 'blue';
		createPoint(cam.x, cam.y);
	}

	function calculatePointsPositionInZeroZ() {
		var lambda = -cam.z/(square.z-cam.z);
		var pointA = {
			x: square.x+(square.x-cam.x)*lambda,
			y: square.y+(square.y-cam.y)*lambda,
			z: 0
		}
		var pointB = {
			x: square.x+square.width+(square.x+square.width-cam.x)*lambda,
			y: square.y+(square.y-cam.y)*lambda,
			z: 0
		}
		var pointC = {
			x: square.x+square.width+(square.x+square.width-cam.x)*lambda,
			y: square.y+square.height+(square.y+square.height-cam.y)*lambda,
			z: 0
		}
		var pointD = {
			x: square.x+(square.x-cam.x)*lambda,
			y: square.y+square.height+(square.y+square.height-cam.y)*lambda,
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