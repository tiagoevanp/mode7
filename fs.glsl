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

		float relation(vec2 p1, vec2 p2) {
			float h = p2.y - p1.y;
			float w = p2.x - p1.x;
			return h/w;
		}

		vec2 xy(vec2 p1, vec2 p2, float x) {
			float r = relation(p1, p2);
			float y = p1.y + (x-p1.x)*r;
			float x2 = p1.x + (y-p1.y)/r;
			return vec2(x2, y);
		}

		vec2 calculatePointsPosition(vec2 st) {
			vec2 D_A = xy(pD, pA, pD.x);
			vec2 C_B = xy(pC, pB, pC.x);
			float x = D_A.x+st.x*(C_B.x-D_A.x);
			float y = D_A.y+st.y*(pA.y-D_A.y);

			return vec2(x, y);
		}

		void main() {
			vec2 st = gl_FragCoord.xy/u_resolution;
			vec2 points = calculatePointsPosition(st);

			gl_FragColor= texture2D(u_map, points);
		}
	
	`;
}