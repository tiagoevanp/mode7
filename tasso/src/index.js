import { createTextureCanvas, renderTextureCanvas } from './textureCanvas';
import { createWebGLCanvas, renderWebGlCanvas } from './webGlCanvas';


const cam = {
	x: 512,
	y: 512,
	z: 300,
	viewportWidth: 100,
	viewportHeight: 100,
	rotX: 0,
	rotZ: 0,
};

const camSquare = {
	A: {},
	B: {},
	C: {},
	D: {},
};

const square = {};

const compute = () => {
	const camAxisZ = {
		x: -Math.sin(cam.rotX) * Math.sin(cam.rotZ),
		y: +Math.sin(cam.rotX) * Math.cos(cam.rotZ),
		z: -Math.cos(cam.rotX) * Math.sin(cam.rotZ),
	};

	const camAxisY = {
		x: -Math.sin(cam.rotX + Math.PI / 2) * Math.sin(cam.rotZ),
		y: +Math.sin(cam.rotX + Math.PI / 2) * Math.cos(cam.rotZ),
		z: -Math.cos(cam.rotX + Math.PI / 2) * Math.sin(cam.rotZ),
	};

	const camAxisX = {
		x: -Math.sin(Math.PI / 2) * Math.sin(cam.rotZ - Math.PI / 2),
		y: +Math.sin(Math.PI / 2) * Math.cos(cam.rotZ - Math.PI / 2),
		z: -Math.cos(Math.PI / 2) * Math.sin(cam.rotZ - Math.PI / 2),
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
		x: cam.x + vecA.x,
		y: cam.y + vecA.y,
		z: cam.z + vecA.z,
	};

	camSquare.B = {
		x: cam.x + vecB.x,
		y: cam.y + vecB.y,
		z: cam.z + vecB.z,
	};

	camSquare.C = {
		x: cam.x + vecC.x,
		y: cam.y + vecC.y,
		z: cam.z + vecC.z,
	};

	camSquare.D = {
		x: cam.x + vecD.x,
		y: cam.y + vecD.y,
		z: cam.z + vecD.z,
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

const update = () => {
	cam.rotX += Math.PI / 100;
	compute();

	requestAnimationFrame(update);
};

update();

const config = {
	cam,
	camSquare,
	square,
};

(async () => {
	await createTextureCanvas(config);
	await createWebGLCanvas(config);

	renderTextureCanvas();
	renderWebGlCanvas();
})();
