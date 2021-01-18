#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot_line(vec2 st, float width) {
  float y = st.x;
  return smoothstep(y - width, st.x, st.y) -
         smoothstep(y, y + width, st.y);
}

float plot_curve(vec2 st, float width) {
  float y = pow(st.x, 3.0);
  return smoothstep(y - width, y, st.y) -
         smoothstep(y, y + width, st.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

  vec3 bg_color = vec3(st.x / 5.0);
  vec3 line_color = vec3(0.0, abs(cos(u_time)), 0.0);
  vec3 curve_color = vec3(abs(sin(u_time)), 0.0, 0.0);

  float width = 0.005;
  float line_percent = plot_line(st, width);
  float curve_percent = plot_curve(st, width);
  float bg_percent = max(0.0, 1.0 - (line_percent + curve_percent));
  
  vec3 color = bg_percent * bg_color +
               curve_percent * curve_color +
               line_percent * line_color;

	gl_FragColor = vec4(color,1.0);
}
