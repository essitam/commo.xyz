precision mediump float;

// we need our texcoords for drawing textures
varying vec2 vTexCoord;

// images are sent to the shader as a variable type called sampler2D
uniform float oscFloat;
uniform sampler2D algaeTex;

void main() {
  // by default, our texcoords will be upside down
  // lets flip them by inverting the y component
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  // we can access our image by using the GLSL shader function texture2D()
  // texture2D expects a sampler2D, and texture coordinates as it's input
  vec4 algae = texture2D(algaeTex, uv);

  // lets invert the colors just for fun
  // algae.rgb = 1.0 - algae.rgb;
  if (algae.g < oscFloat) {
  algae.g = 1.0 - oscFloat;
  };

  gl_FragColor = algae;
}
