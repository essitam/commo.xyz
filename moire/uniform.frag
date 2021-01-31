precision mediump float;
varying vec2 vTexCoord;

uniform sampler2D uSampler;
uniform float time;
uniform float frequency;
uniform float amplitude;
uniform float amplitudeY;
uniform float speed;

void main() {
  vec2 position = vTexCoord;
  float distortion = sin(position.y * frequency + time * speed) * amplitude;
  float distortion2 = sin(position.y * frequency + time * speed) * amplitudeY;
  gl_FragColor = texture2D(uSampler, vec2(position.x + distortion, position.y + distortion2));
}
