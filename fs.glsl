function fs() {
	return `
		#ifdef GL_ES
			precision highp float;
		#endif

		uniform vec2 u_resolution;
		uniform float u_time;

		void main() {
			vec2 st = gl_FragCoord.xy/u_resolution;
			gl_FragColor=vec4(st.y-st.x, st.x-st.y, 0.0, 1.0);
		}
	
	`;
}