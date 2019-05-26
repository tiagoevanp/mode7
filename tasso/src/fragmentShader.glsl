#ifdef GL_ES
	precision highp float;
#endif

#define USE_MAP true

uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

	gl_FragColor= vec4(0.0, 0.5, 1.0, 1.0);
}
