window.onload = function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var webgl = document.getElementById('webgl');
	var gl = webgl.getContext('webgl');
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
		ctx.drawImage(myImg, 0, 0, canvas.width, canvas.height);
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
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		drawGL(data)
	}

	function drawGL(data) {
		const canvas = document.getElementById("webgl");
		const gl = canvas.getContext("webgl");
		
		const vsSource = `
			attribute vec4 aVertexPosition;
			attribute vec2 aTextureCoord;
			
			varying highp vec2 vTextureCoord;

			void main() {
				gl_Position = aVertexPosition;
				vTextureCoord = aTextureCoord;
			}
		`;

		const fsSource = `
			varying highp vec2 vTextureCoord;
			uniform sampler2D uSampler;
			
			void main() {
				gl_FragColor = texture2D(uSampler, vTextureCoord);
			}
		`;

		const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

		const programInfo = {
			program: shaderProgram,
			attribLocations: {
				vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
				textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
			},
			uniformLocations: {
				uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
			},
		};

		const buffers = initBuffers(gl, data);
		
		drawScene(gl, programInfo, buffers);
	}

	function loadTexture(gl, url) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
	
		const level = 0;
		const internalFormat = gl.RGBA;
		const width = 1;
		const height = 1;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;
		const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
		const image = new Image();
		image.src = url;

		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
		
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
	
		return texture;
	}
	
	function isPowerOf2(value) {
		return (value & (value - 1)) == 0;
	}

	function drawScene(gl, programInfo, buffers) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
	
	
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
		const fieldOfView = 45 * Math.PI / 180;   // in radians
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = mat4.create();
		const texture = loadTexture(gl, 'img.png');

		mat4.perspective(projectionMatrix,
										 fieldOfView,
										 aspect,
										 zNear,
										 zFar);
	

		const modelViewMatrix = mat4.create();
	
		mat4.translate(modelViewMatrix,     // destination matrix
									 modelViewMatrix,     // matrix to translate
									 [-0.0, 0.0, -6.0]);  // amount to translate

		{
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
			gl.vertexAttribPointer(
					programInfo.attribLocations.vertexPosition,
					numComponents,
					type,
					normalize,
					stride,
					offset);
			gl.enableVertexAttribArray(
					programInfo.attribLocations.vertexPosition);
		}
	
		{
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
			gl.vertexAttribPointer(
					programInfo.attribLocations.textureCoord,
					numComponents,
					type,
					normalize,
					stride,
					offset);
			gl.enableVertexAttribArray(
					programInfo.attribLocations.textureCoord);
		}
	
		gl.useProgram(programInfo.program);
	
		{
			const offset = 0;
			const vertexCount = 4;
			gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
		}

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
	}

	function initBuffers(gl, data) {

		const positionBuffer = gl.createBuffer();
	
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
		const positions = [
		-1.0,  1.0,
		 1.0,  1.0,
    -1.0, -1.0,
     1.0, -1.0,
		];

		gl.bufferData(gl.ARRAY_BUFFER,
									new Float32Array(positions),
									gl.STATIC_DRAW);

		const textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

		const textureCoordinates = [
		0.5,  1.0,
		1.0,  1.0,
    0.0, 0.0,
    1.0, 0.0,
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
								gl.STATIC_DRAW);
								
	
		return {
			position: positionBuffer,
			textureCoord: textureCoordBuffer,
		};
	}

	function initShaderProgram(gl, vsSource, fsSource) {
		const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
		const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
	
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
	
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
			return null;
		}
	
		return shaderProgram;
	}
	
	function loadShader(gl, type, source) {
		const shader = gl.createShader(type);
	
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
	
		return shader;
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
}