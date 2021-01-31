precision mediump float;
varying vec2 vTexCoord;
uniform sampler2D t;
uniform vec2 mouse;
uniform float time, amp, freq, moving;
vec2 lookup (vec2 offset, float amp2) {
  return mod(
    vTexCoord + amp2 * amp * vec2(
      cos(freq*(vTexCoord.x+offset.x)+time),
      sin(freq*(vTexCoord.y+offset.x)+time))
      + vec2(
        moving * time/10.0,
        0.0),
    vec2(1.0));
}
void main() {
  float dist = distance(vTexCoord, mouse);
  float amp2 = pow(1.0 - dist, 2.0);
  float colorSeparation = 0.02 * mix(amp2, 1.0, 0.5);
  vec2 orientation = vec2(1.0, 0.0);
  gl_FragColor = vec4(vec3(
    texture2D(t, lookup(colorSeparation * orientation, amp2)).r,
    texture2D(t, lookup(-colorSeparation * orientation, amp2)).g,
    texture2D(t, lookup(vec2(0.0), amp2)).b),
    1.0);
}
