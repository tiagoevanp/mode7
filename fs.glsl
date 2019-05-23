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

		vec2 pA = u_points[0];
		vec2 pB = u_points[1];
		vec2 pC = u_points[2];
		vec2 pD = u_points[3];

		float lambda(vec2 p1, vec2 p2) {
			float h = p2.y;
			float w = p2.x - p1.x;
			return h/w;
		}

		float x(vec2 p1, vec2 p2, float y) {
			float l = lambda(p1, p2);
			float x = p1.x - (y-p2.y)/l;
			return x;
		}

		vec2 calculatePointsPosition(vec2 st) {
			float y = pD.y+(pD.y+st.y*(pA.y-pD.y))*(st.y*(pA.y-pD.y));
			
			float D_A = x(pD, pA, y);
			float C_B = x(pC, pB, 1.0);
			
			float x = D_A+st.x/6.0;

			return vec2(x, y);
		}

		void main() {
			vec2 st = gl_FragCoord.xy/u_resolution;
			vec2 points = calculatePointsPosition(st);

			gl_FragColor= texture2D(u_map, points);
		}
	
	`;
}