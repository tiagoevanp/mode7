import texturePath from 'file-loader!./image.png';

let textureCanvas;
let textureImage;
let state;

function loadImage() {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = texturePath;
	});
}

export async function createTextureCanvas(initialState = {}) {
	state = initialState;

	textureImage = await loadImage();

	textureCanvas = document.createElement('canvas');
	textureCanvas.width = 400;
	textureCanvas.height = 400;

	document.body.appendChild(textureCanvas);
}

export function renderTextureCanvas() {
	const context = textureCanvas.getContext('2d');
	context.drawImage(textureImage, 0, 0, 400, 400);

	const { cam, camSquare } = state;

	const [camU, camV] = [
		 cam.x / textureImage.naturalWidth * 400,
		 400 - cam.y / textureImage.naturalHeight * 400,
	];

	const [aU, aV] = [
		camSquare.A.x / textureImage.naturalWidth * 400,
		400 - camSquare.A.y / textureImage.naturalHeight * 400,
	];

	const [bU, bV] = [
		camSquare.B.x / textureImage.naturalWidth * 400,
		400 - camSquare.B.y / textureImage.naturalHeight * 400,
	];

	const [cU, cV] = [
		camSquare.C.x / textureImage.naturalWidth * 400,
		400 - camSquare.C.y / textureImage.naturalHeight * 400,
	];

	const [dU, dV] = [
		camSquare.D.x / textureImage.naturalWidth * 400,
		400 - camSquare.D.y / textureImage.naturalHeight * 400,
	];

	context.save();

	context.strokeStyle = 'rgba(255, 0, 0, 0.75)';
	context.lineWidth = 1;

	context.beginPath();
	context.moveTo(aU, aV);
	context.lineTo(bU, bV);
	context.lineTo(cU, cV);
	context.lineTo(dU, dV);
	context.lineTo(aU, aV);
	context.stroke();

	context.save();

	context.font = 'normal 1rem sans-serif';
	context.fillStyle = 'white';
	context.shadowColor = 'black';
	context.shadowOffsetX = 1;
	context.shadowOffsetY = 1;

	context.fillRect(camU - 2, camV - 2, 4, 4);
	context.fillText('cam', camU + 2, camV - 2);

	context.fillRect(aU - 2, aV - 2, 4, 4);
	context.fillText('A', aU + 2, aV - 2);
	context.fillRect(bU - 2, bV - 2, 4, 4);
	context.fillText('B', bU + 2, bV - 2);
	context.fillRect(cU - 2, cV - 2, 4, 4);
	context.fillText('C', cU + 2, cV - 2);
	context.fillRect(dU - 2, dV - 2, 4, 4);
	context.fillText('D', dU + 2, dV - 2);

	context.restore();
	context.restore();

	requestAnimationFrame(renderTextureCanvas);
}
