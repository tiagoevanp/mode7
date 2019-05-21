var container;
var camera, scene, renderer;
var uniforms;
var texture;
var points;
var matrix;
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
	
	function render() {
		points = calculatePointsPositionInZeroZ();
		
		uniforms.u_points.value[0].x = points.a.x/1000;
		uniforms.u_points.value[0].y = points.a.y/1000;
		uniforms.u_points.value[1].x = points.b.x/1000;
		uniforms.u_points.value[1].y = points.b.y/1000;
		uniforms.u_points.value[2].x = points.c.x/1000;
		uniforms.u_points.value[2].y = points.c.y/1000;
		uniforms.u_points.value[3].x = points.d.x/1000;
		uniforms.u_points.value[3].y = points.d.y/1000;

		uniforms.u_time.value += 0.05;
		
		renderer.render( scene, camera );
}