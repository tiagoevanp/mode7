import {
	WebGLRenderer,
	TextureLoader,
	Camera,
	Scene,
	PlaneBufferGeometry,
	Vector2,
	Mesh,
	ShaderMaterial,
	Vector3,
} from 'three';
import texturePath from 'file-loader!./image.png';
import fragmentShaderPath from 'file-loader!./fragmentShader.glsl';

let state;
let renderer;
let scene;
let camera;
let uniforms;
let points;
let percentPoints;

function loadTexture() {
	return new Promise((resolve, reject) => new TextureLoader().load(texturePath, resolve, null, reject));
}

async function loadFragmentShader() {
	const response = await fetch(fragmentShaderPath);
	return await response.text();
}

export async function createWebGLCanvas(initialState = {}) {
	state = initialState;

	renderer = new WebGLRenderer();
	renderer.setSize(400, 400);
	renderer.setPixelRatio(window.devicePixelRatio);

	scene = new Scene();

	const geometry = new PlaneBufferGeometry(2, 2);

	uniforms = {
		u_map: {
			type: 't',
			value: await loadTexture(),
		},
		u_time: {
			type: 'f',
			value: 0.0,
		},
		u_resolution: {
			type: 'v2',
			value: new Vector2(renderer.domElement.width, renderer.domElement.height),
		},
		u_camera: {
			type: 'v3',
			value: new Vector3(),
		},
		u_camera_square: {
			type: 'v3v',
			value: [
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
			],
		},
	};

	const fragmentShader = await loadFragmentShader();

	const material = new ShaderMaterial({ uniforms, fragmentShader });

	const mesh = new Mesh(geometry, material);
	scene.add(mesh);

	camera = new Camera();
	camera.position.z = 1;

	document.body.appendChild(renderer.domElement);
}

function calculatePercentageOfPoints(p, img) {
	var percents = {};
	percents.a = { x: p.a.x/img.width, y: (img.height - p.a.y)/img.height };
	percents.b = { x: p.b.x/img.width, y: (img.height - p.b.y)/img.height };
	percents.c = { x: p.c.x/img.width, y: (img.height - p.c.y)/img.height };
	percents.d = { x: p.d.x/img.width, y: (img.height - p.d.y)/img.height };

	return percents;
}

function calculatePointsPositionInZeroZ() {
	const { cam, camSquare } = state;

	var lambda = cam.z/(cam.z-camSquare.A.z);
	var pointA = {
		x: lambda*(camSquare.A.x-cam.x)+cam.x,
		y: lambda*(camSquare.A.y-cam.y)+cam.y,
		z: 0
	}

	lambda = -cam.z/(camSquare.B.z-cam.z);
	var pointB = {
		x: lambda*(camSquare.B.x-cam.x)+cam.x,
		y: lambda*(camSquare.B.y-cam.y)+cam.y,
		z: 0
	}

	lambda = -cam.z/(camSquare.C.z-cam.z);
	var pointC = {
		x: lambda*(camSquare.C.x-cam.x)+cam.x,
		y: lambda*(camSquare.C.y-cam.y)+cam.y,
		z: 0
	}

	lambda = -cam.z/(camSquare.D.z-cam.z);
	var pointD = {
		x: lambda*(camSquare.D.x-cam.x)+cam.x,
		y: lambda*(camSquare.D.y-cam.y)+cam.y,
		z: 0
	}
	return {
		a: pointA,
		b: pointB,
		c: pointC,
		d: pointD
	};
}

let firstRenderTime;
export function renderWebGlCanvas() {
	if (!firstRenderTime) {
		firstRenderTime = Date.now();
	}

	const { cam, camSquare } = state;

	uniforms.u_time.value = (Date.now() - firstRenderTime) / 1000;
	uniforms.u_camera.value = new Vector3(cam.x, cam.y, cam.z);
	uniforms.u_camera_square.value[0] = new Vector3(camSquare.A.x, camSquare.A.y, camSquare.A.z);
	uniforms.u_camera_square.value[1] = new Vector3(camSquare.B.x, camSquare.B.y, camSquare.B.z);
	uniforms.u_camera_square.value[2] = new Vector3(camSquare.C.x, camSquare.C.y, camSquare.C.z);
	uniforms.u_camera_square.value[3] = new Vector3(camSquare.D.x, camSquare.D.y, camSquare.D.z);

	renderer.render(scene, camera);

	requestAnimationFrame(renderWebGlCanvas);
}
