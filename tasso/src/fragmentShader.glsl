#ifdef GL_ES
	precision highp float;
#endif

#define USE_MAP true

uniform sampler2D u_map;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_camera;
uniform vec3 u_camera_square[4];

void main() {
	vec2 st = gl_FragCoord.xy / u_resolution;

	vec3 A = u_camera_square[0];
	vec3 B = u_camera_square[1];
	vec3 C = u_camera_square[2];
	vec3 D = u_camera_square[3];

	vec3 L = st.y * D + (1.0 - st.y) * A;
	vec3 R = st.y * C + (1.0 - st.y) * B;

	vec3 W = st.x * R + (1.0 - st.x) * L;

	float lambda = u_camera.z / (u_camera.z - W.z);
	vec2 w = vec2(
		u_camera.x + (W.x - u_camera.x) * lambda,
		u_camera.y + (W.y - u_camera.y) * lambda
	) / vec2(1024.0, 1024.0);

	gl_FragColor = texture2D(u_map, w);
}
