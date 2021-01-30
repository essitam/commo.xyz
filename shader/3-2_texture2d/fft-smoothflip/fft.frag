precision mediump float;

// we need our texcoords for drawing textures
varying vec2 vTexCoord;

// images are sent to the shader as a variable type called sampler2D
uniform sampler2D leftBuf;
uniform sampler2D midBuf;
uniform sampler2D rightBuf;
uniform float leftFloat;
uniform float midFloat;
uniform float rightFloat;
uniform vec4 fftBinValues;

void main() {
  // by default, our texcoords will be upside down
  // lets flip them by inverting the y component
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  // we can access our image by using the GLSL shader function texture2D()
  // texture2D expects a sampler2D, and texture coordinates as it's input
  vec4 algae = texture2D(midBuf, uv);
  algae.a = midFloat;

  float brightness = (algae.r + algae.r + algae.g + algae.g + algae.g + algae.b) / 6.0;

  if (0.0<brightness && brightness<=0.25){
    algae.a *= fftBinValues.x;
  } else if (0.25<brightness && brightness<=0.5){
    algae.a *= fftBinValues.y;
  } else if (0.5<brightness && brightness<=0.75){
    algae.a *= fftBinValues.z;
  } else {
    algae.a *= fftBinValues.w;
  }

  vec4 left = texture2D(leftBuf, uv);
  left.a = leftFloat;

  float bl = (left.r + left.r + left.g + left.g + left.g + left.b) / 6.0;

  if (0.0<bl && bl<=0.25){
    left.a *= fftBinValues.x;
  } else if (0.25<bl && bl<=0.5){
    left.a *= fftBinValues.y;
  } else if (0.5<bl && bl<=0.75){
    left.a *= fftBinValues.z;
  } else {
    left.a *= fftBinValues.w;
  }

  vec4 right = texture2D(rightBuf, uv);
  right.a = rightFloat;

  float br = (right.r + right.r + right.g + right.g + right.g + right.b) / 6.0;

  if (0.0<br && br<=0.25){
    right.a *= fftBinValues.x;
  } else if (0.25<br && br<=0.5){
    right.a *= fftBinValues.y;
  } else if (0.5<br && br<=0.75){
    right.a *= fftBinValues.z;
  } else {
    right.a *= fftBinValues.w;
  }

  vec4 firstmix = mix(left, algae, algae.a);

  gl_FragColor = mix(right, firstmix, firstmix.a);
}
