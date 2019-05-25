import {
	WebGLRenderer,
	TextureLoader,
	Camera,
	Scene,
	PlaneBufferGeometry,
	Vector2,
	Mesh,
	ShaderMaterial,
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
		u_time: {
			type: 'f',
			value: 0.0,
		},
		u_resolution: {
			type: 'v2',
			value: new Vector2(renderer.domElement.width, renderer.domElement.height),
		},
		u_points: {
			type: 'v2v',
			value: [
				new Vector2(),
				new Vector2(),
				new Vector2(),
				new Vector2(),
			],
		},
		u_map: {
			type: 't',
			value: await loadTexture(),
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
	const { cam, square } = state;

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

let firstRenderTime;
export function renderWebGlCanvas() {
	if (!firstRenderTime) {
		firstRenderTime = Date.now();
	}

	points = calculatePointsPositionInZeroZ();
	percentPoints = calculatePercentageOfPoints(points, uniforms.u_map.value.image);

	uniforms.u_points.value[0].x = percentPoints.a.x;
	uniforms.u_points.value[0].y = percentPoints.a.y;
	uniforms.u_points.value[1].x = percentPoints.b.x;
	uniforms.u_points.value[1].y = percentPoints.b.y;
	uniforms.u_points.value[2].x = percentPoints.c.x;
	uniforms.u_points.value[2].y = percentPoints.c.y;
	uniforms.u_points.value[3].x = percentPoints.d.x;
	uniforms.u_points.value[3].y = percentPoints.d.y;

	uniforms.u_time.value = (Date.now() - firstRenderTime) / 1000;

	renderer.render(scene, camera);

	requestAnimationFrame(renderWebGlCanvas);
}
