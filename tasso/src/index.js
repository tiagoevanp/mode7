import { createTextureCanvas, renderTextureCanvas } from './textureCanvas';
import { createWebGLCanvas, renderWebGlCanvas } from './webGlCanvas';


const cam = {
	x: 512,
	y: 512,
	z: 200,
	squareDistance: 200,
	viewportWidth: 100,
	viewportHeight: 100,
	inclination: Math.PI / 2,
	azimuth: Math.PI / 2,
};

const camSquare = {
	A: {},
	B: {},
	C: {},
	D: {},
};

const projectedCamSquare = {
	A: {},
	B: {},
	C: {},
	D: {},
};

const square = {};

const compute = () => {
	const camAxisX = {
		x: Math.sin(cam.inclination) * Math.cos(cam.azimuth),
		y: Math.sin(cam.inclination) * Math.sin(cam.azimuth),
		z: Math.cos(cam.inclination),
	};

	const camAxisY = {
		x: Math.sin(Math.PI / 2) * Math.cos(cam.azimuth + Math.PI / 2),
		y: Math.sin(Math.PI / 2) * Math.sin(cam.azimuth + Math.PI / 2),
		z: Math.cos(Math.PI / 2),
	};

	const camAxisZ = {
		x: Math.sin(cam.inclination + Math.PI / 2) * Math.cos(cam.azimuth),
		y: Math.sin(cam.inclination + Math.PI / 2) * Math.sin(cam.azimuth),
		z: Math.cos(cam.inclination + Math.PI / 2),
	};

	cam.axisX = camAxisX;
	cam.axisY = camAxisY;
	cam.axisZ = camAxisZ;

	const vecSquare = {
		x: -cam.squareDistance * camAxisZ.x,
		y: -cam.squareDistance * camAxisZ.y,
		z: -cam.squareDistance * camAxisZ.z,
	};

	const vecA = {
		x: cam.viewportWidth / 2 * -camAxisX.x + cam.viewportHeight / 2 * -camAxisY.x,
		y: cam.viewportWidth / 2 * -camAxisX.y + cam.viewportHeight / 2 * -camAxisY.y,
		z: cam.viewportWidth / 2 * -camAxisX.z + cam.viewportHeight / 2 * -camAxisY.z,
	};

	const vecB = {
		x: cam.viewportWidth / 2 * +camAxisX.x + cam.viewportHeight / 2 * -camAxisY.x,
		y: cam.viewportWidth / 2 * +camAxisX.y + cam.viewportHeight / 2 * -camAxisY.y,
		z: cam.viewportWidth / 2 * +camAxisX.z + cam.viewportHeight / 2 * -camAxisY.z,
	};

	const vecC = {
		x: cam.viewportWidth / 2 * +camAxisX.x + cam.viewportHeight / 2 * +camAxisY.x,
		y: cam.viewportWidth / 2 * +camAxisX.y + cam.viewportHeight / 2 * +camAxisY.y,
		z: cam.viewportWidth / 2 * +camAxisX.z + cam.viewportHeight / 2 * +camAxisY.z,
	};

	const vecD = {
		x: cam.viewportWidth / 2 * -camAxisX.x + cam.viewportHeight / 2 * +camAxisY.x,
		y: cam.viewportWidth / 2 * -camAxisX.y + cam.viewportHeight / 2 * +camAxisY.y,
		z: cam.viewportWidth / 2 * -camAxisX.z + cam.viewportHeight / 2 * +camAxisY.z,
	};

	camSquare.A = {
		x: cam.x + vecSquare.x + vecA.x,
		y: cam.y + vecSquare.y + vecA.y,
		z: cam.z + vecSquare.z + vecA.z,
	};

	camSquare.B = {
		x: cam.x + vecSquare.x + vecB.x,
		y: cam.y + vecSquare.y + vecB.y,
		z: cam.z + vecSquare.z + vecB.z,
	};

	camSquare.C = {
		x: cam.x + vecSquare.x + vecC.x,
		y: cam.y + vecSquare.y + vecC.y,
		z: cam.z + vecSquare.z + vecC.z,
	};

	camSquare.D = {
		x: cam.x + vecSquare.x + vecD.x,
		y: cam.y + vecSquare.y + vecD.y,
		z: cam.z + vecSquare.z + vecD.z,
	};

	const distCamToAny = Math.sqrt(
		Math.pow(camSquare.A.x - cam.x, 2) +
		Math.pow(camSquare.A.y - cam.y, 2) +
		Math.pow(camSquare.A.z - cam.z, 2)
	);

	const vecCamToA = {
		x: (camSquare.A.x - cam.x) / distCamToAny,
		y: (camSquare.A.y - cam.y) / distCamToAny,
		z: (camSquare.A.z - cam.z) / distCamToAny,
	};

	const lambdaA = cam.z / (vecCamToA.z * distCamToAny);

	const vecCamToB = {
		x: (camSquare.B.x - cam.x) / distCamToAny,
		y: (camSquare.B.y - cam.y) / distCamToAny,
		z: (camSquare.B.z - cam.z) / distCamToAny,
	};

	const lambdaB = cam.z / (vecCamToB.z * distCamToAny);

	const vecCamToC = {
		x: (camSquare.C.x - cam.x) / distCamToAny,
		y: (camSquare.C.y - cam.y) / distCamToAny,
		z: (camSquare.C.z - cam.z) / distCamToAny,
	};

	const lambdaC = cam.z / (vecCamToC.z * distCamToAny);

	const vecCamToD = {
		x: (camSquare.D.x - cam.x) / distCamToAny,
		y: (camSquare.D.y - cam.y) / distCamToAny,
		z: (camSquare.D.z - cam.z) / distCamToAny,
	};

	const lambdaD = cam.z / (vecCamToD.z * distCamToAny);

	projectedCamSquare.A = {
		x: cam.x + vecCamToA.x * distCamToAny * lambdaA,
		y: cam.y + vecCamToA.y * distCamToAny * lambdaA,
	};

	projectedCamSquare.B = {
		x: cam.x + vecCamToB.x * distCamToAny * lambdaB,
		y: cam.y + vecCamToB.y * distCamToAny * lambdaB,
	};

	projectedCamSquare.C = {
		x: cam.x + vecCamToC.x * distCamToAny * lambdaC,
		y: cam.y + vecCamToC.y * distCamToAny * lambdaC,
	};

	projectedCamSquare.D = {
		x: cam.x + vecCamToD.x * distCamToAny * lambdaD,
		y: cam.y + vecCamToD.y * distCamToAny * lambdaD,
	};

	square.xA = camSquare.A.x;
	square.yA = camSquare.A.y;
	square.zA = camSquare.A.z;

	square.xB = camSquare.B.x;
	square.yB = camSquare.B.y;
	square.zB = camSquare.B.z;

	square.xC = camSquare.C.x;
	square.yC = camSquare.C.y;
	square.zC = camSquare.C.z;

	square.xD = camSquare.D.x;
	square.yD = camSquare.D.y;
	square.zD = camSquare.D.z;
};

const keyPressed = {
	left: false,
	top: false,
	right: false,
	bottom: false,
};

document.addEventListener('keydown', ({ keyCode }) => {
	keyPressed.left = keyCode === 65 || keyPressed.left;
	keyPressed.top = keyCode === 87 || keyPressed.top;
	keyPressed.right = keyCode === 68 || keyPressed.right;
	keyPressed.bottom = keyCode === 83 || keyPressed.bottom;
});

document.addEventListener('keyup', ({ keyCode }) => {
	keyPressed.left = keyCode !== 65 && keyPressed.left;
	keyPressed.top = keyCode !== 87 && keyPressed.top;
	keyPressed.right = keyCode !== 68 && keyPressed.right;
	keyPressed.bottom = keyCode !== 83 && keyPressed.bottom;
});

const update = () => {
	if (keyPressed.left) cam.azimuth += Math.PI / 100;
	if (keyPressed.right) cam.azimuth -= Math.PI / 100;
	if (keyPressed.top) cam.inclination += Math.PI / 100;
	if (keyPressed.bottom) cam.inclination -= Math.PI / 100;

	compute();

	requestAnimationFrame(update);
};

update();

const config = {
	cam,
	camSquare,
	projectedCamSquare,
	square,
};

(async () => {
	await createTextureCanvas(config);
	await createWebGLCanvas(config);

	renderTextureCanvas();
	renderWebGlCanvas();
})();
