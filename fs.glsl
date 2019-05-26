function fs() {
	return `

		#ifdef GL_ES
			precision highp float;
		#endif

		#define USE_MAP true
		#define PI_DIV_2 1.57079632679

		uniform vec2 u_resolution;
		uniform float u_time;
		uniform sampler2D u_map;
		uniform vec2 u_points[4];
		uniform vec3 u_camera;

		vec2 pA = u_points[0];
		vec2 pB = u_points[1];
		vec2 pC = u_points[2];
		vec2 pD = u_points[3];

		void main() {
			vec2 st = gl_FragCoord.xy/u_resolution;

			float x = st.x;
			vec2 pAB = x * pB + (1.0 - x) * pA;
			vec2 pDC = x * pC + (1.0 - x) * pD;

			float tanAlfa = (pDC.y - u_camera.y) / u_camera.z;
			float tanBeta = (pAB.y - u_camera.y) / u_camera.z;
			float alfa = atan(tanAlfa);
			float beta = atan(tanBeta);
			float omega = asin(st.y * sin((beta - alfa) / 2.0) + (1.0 - st.y) * sin(-(beta - alfa) / 2.0)) + alfa;
			float tanOmega = tan(omega);
			float y = (tanOmega - tanAlfa) / (tanBeta - tanAlfa);

			vec2 pDA = y * pA + (1.0 - y) * pD;
			vec2 pCB = y * pB + (1.0 - y) * pC;

			vec2 Z = x * pCB + (1.0 - x) * pDA;

			gl_FragColor = texture2D(u_map, Z);
		}
	`;
}
