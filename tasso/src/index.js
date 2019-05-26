import { createTextureCanvas, renderTextureCanvas } from './textureCanvas';
import { createWebGLCanvas, renderWebGlCanvas } from './webGlCanvas';


const cam = {
	x: 64,
	y: 400,
	z: 15,
	squareDistance: 10,
	viewportWidth: 25,
	viewportHeight: 25,
	rotX: 0.7853981633974483,
	rotZ: 0,
};

const camSquare = {
	A: {},
	B: {},
	C: {},
	D: {},
};

const rotateZ = ({ x, y, z }, theta) => ({
	x: Math.cos(theta) * x + -Math.sin(theta) * y,
	y: Math.sin(theta) * x + Math.cos(theta) * y,
	z,
});

const rotateX = ({ x, y, z }, theta) => ({
	x,
	y: Math.cos(theta) * y + -Math.sin(theta) * z,
	z: Math.sin(theta) * y + Math.cos(theta) * z,
})

const compute = () => {
	const camAxis = rotateZ(rotateX({ x: 0, y: 0, z: -1 }, cam.rotX), cam.rotZ);
	const camPlaneAxisX = rotateZ(rotateX({ x: 1, y: 0, z: 0 }, cam.rotX), cam.rotZ);
	const camPlaneAxisY = rotateZ(rotateX({ x: 0, y: 1, z: 0 }, cam.rotX), cam.rotZ);

	cam.axis = camAxis;
	cam.planeAxisX = camPlaneAxisX;
	cam.planeAxisY = camPlaneAxisY;

	const vecSquare = {
		x: cam.squareDistance * camAxis.x,
		y: cam.squareDistance * camAxis.y,
		z: cam.squareDistance * camAxis.z,
	};

	const vecA = {
		x: cam.viewportWidth / 2 * -camPlaneAxisX.x + cam.viewportHeight / 2 * -camPlaneAxisY.x,
		y: cam.viewportWidth / 2 * -camPlaneAxisX.y + cam.viewportHeight / 2 * -camPlaneAxisY.y,
		z: cam.viewportWidth / 2 * -camPlaneAxisX.z + cam.viewportHeight / 2 * -camPlaneAxisY.z,
	};

	const vecB = {
		x: cam.viewportWidth / 2 * +camPlaneAxisX.x + cam.viewportHeight / 2 * -camPlaneAxisY.x,
		y: cam.viewportWidth / 2 * +camPlaneAxisX.y + cam.viewportHeight / 2 * -camPlaneAxisY.y,
		z: cam.viewportWidth / 2 * +camPlaneAxisX.z + cam.viewportHeight / 2 * -camPlaneAxisY.z,
	};

	const vecC = {
		x: cam.viewportWidth / 2 * +camPlaneAxisX.x + cam.viewportHeight / 2 * +camPlaneAxisY.x,
		y: cam.viewportWidth / 2 * +camPlaneAxisX.y + cam.viewportHeight / 2 * +camPlaneAxisY.y,
		z: cam.viewportWidth / 2 * +camPlaneAxisX.z + cam.viewportHeight / 2 * +camPlaneAxisY.z,
	};

	const vecD = {
		x: cam.viewportWidth / 2 * -camPlaneAxisX.x + cam.viewportHeight / 2 * +camPlaneAxisY.x,
		y: cam.viewportWidth / 2 * -camPlaneAxisX.y + cam.viewportHeight / 2 * +camPlaneAxisY.y,
		z: cam.viewportWidth / 2 * -camPlaneAxisX.z + cam.viewportHeight / 2 * +camPlaneAxisY.z,
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
	if (keyPressed.left) cam.rotZ += Math.PI / 100;
	if (keyPressed.right) cam.rotZ -= Math.PI / 100;

	const camAxis = rotateZ(rotateX({ x: 0, y: 0, z: -1 }, cam.rotX), cam.rotZ);
	if (keyPressed.top) {
		cam.x += camAxis.x * 4;
		cam.y += camAxis.y * 4;
	}

	if (keyPressed.bottom) {
		cam.x -= camAxis.x * 4;
		cam.y -= camAxis.y * 4;
	}

	compute();

	requestAnimationFrame(update);
};

update();

const config = {
	cam,
	camSquare,
};

(async () => {
	await createTextureCanvas(config);
	await createWebGLCanvas(config);

	renderTextureCanvas();
	renderWebGlCanvas();
})();
