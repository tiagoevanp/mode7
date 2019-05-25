import { createTextureCanvas, renderTextureCanvas } from './textureCanvas';
import { createWebGLCanvas, renderWebGlCanvas } from './webGlCanvas';


const cam = {
	x: 200,
	y: 300,
	z: 500
};

const square = {
	xA: cam.x - 50,
	xB: cam.x + 50,
	xC: cam.x + 50,
	xD: cam.x - 50,
	yA: cam.y - 50,
	yB: cam.y - 50,
	yC: cam.y + 50,
	yD: cam.y + 50,
	zA: cam.z - 300,
	zB: cam.z - 300,
	zC: cam.z - 300,
	zD: cam.z - 300,
};

const config = {
	cam,
	square,
};

(async () => {
	await createTextureCanvas(config);
	await createWebGLCanvas(config);

	renderTextureCanvas();
	renderWebGlCanvas();
})();
