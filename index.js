window.onload = function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var cam = {
		x: 400,
		y: 400,
		z: 100
	}
	
	var square = {
		xA: cam.x-100,
		xB: cam.x+100,
		xC: cam.x+100,
		xD: cam.x-100,
		yA: cam.y-150,
		yB: cam.y-150,
		yC: cam.y+10,
		yD: cam.y+10,
		zA: cam.z-50,
		zB: cam.z-50,
		zC: cam.z-100,
		zD: cam.z-100,
	}
	
	var points = calculatePointsPositionInZeroZ();
	console.log(points);
	drawPathIntoPoints(points);
	drawPoints(points);
	
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