#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 m = u_mouse.xy / u_resolution.xy;
  gl_FragColor = vec4(
                      (st.x + m.x) / 2.0,
                      (st.y + m.y) / 2.0,
                      abs(sin(u_time)),
                      1.0
                      );
}
