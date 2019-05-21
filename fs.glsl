function fs() {
	return `
		#ifdef GL_ES
			precision highp float;
		#endif

		#define USE_MAP true

		uniform vec2 u_resolution;
		uniform float u_time;
		uniform sampler2D u_map;
		uniform vec2 u_points[4];

		void main() {
			vec2 st = gl_FragCoord.xy/u_resolution;
			gl_FragColor= texture2D(u_map, vec2(u_points[0].x+st.x/8.0, 0.8+st.y/8.0));
		}
	
	`;
}