var container;
var camera, scene, renderer;
var uniforms;
var texture;
var matrix;
var points;
var percentPoints;
var size = 0.01;

init();
animate();

function init() {
		container = document.getElementById( 'container' );

		camera = new THREE.Camera();
		camera.position.z = 1;

		texture = new THREE.TextureLoader().load( "img2.png" );

		scene = new THREE.Scene();


		var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
		
		matrix = [
			new THREE.Vector2(),
			new THREE.Vector2(),
			new THREE.Vector2(),
			new THREE.Vector2(),
		];

		uniforms = {
				u_time: { type: "f", value: 0.0 },
				u_resolution: { type: "v2", value: new THREE.Vector2() },
				u_mouse: { type: "v2", value: new THREE.Vector2() },
				u_points: { type: "v2v",  value: matrix },
				u_map: { type: "t", value: texture }
		};

		var material = new THREE.ShaderMaterial( {
				uniforms: uniforms,
				vertexShader: vs(),
				fragmentShader: fs()
		} );
		
		// var material = new THREE.MeshBasicMaterial( { map: texture} );

		var mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		renderer = new THREE.WebGLRenderer();
		
		renderer.setSize( 400, 400);
		uniforms.u_resolution.value.x = renderer.domElement.width;
		uniforms.u_resolution.value.y = renderer.domElement.height;
		
		renderer.setPixelRatio( window.devicePixelRatio );

		container.appendChild( renderer.domElement );

		document.onmousemove = function(e){
			uniforms.u_mouse.value.x = e.pageX
			uniforms.u_mouse.value.y = e.pageY
		}
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function calculatePercentageOfPoints(p, img) {
	percents = {};
	percents.a = { x: p.a.x/img.width, y: (img.height - p.a.y)/img.height };
	percents.b = { x: p.b.x/img.width, y: (img.height - p.b.y)/img.height };
	percents.c = { x: p.c.x/img.width, y: (img.height - p.c.y)/img.height };
	percents.d = { x: p.d.x/img.width, y: (img.height - p.d.y)/img.height };
	
	return percents;
}

function render() {
	if(texture.image) {

		points = calculatePointsPositionInZeroZ();
		percentPoints = calculatePercentageOfPoints(points, texture.image);
		uniforms.u_points.value[0].x = percentPoints.a.x;
		uniforms.u_points.value[0].y = percentPoints.a.y;
		uniforms.u_points.value[1].x = percentPoints.b.x;
		uniforms.u_points.value[1].y = percentPoints.b.y;
		uniforms.u_points.value[2].x = percentPoints.c.x;
		uniforms.u_points.value[2].y = percentPoints.c.y;
		uniforms.u_points.value[3].x = percentPoints.d.x;
		uniforms.u_points.value[3].y = percentPoints.d.y;
		
		uniforms.u_time.value += 0.05;
		
		renderer.render( scene, camera );
	}
}