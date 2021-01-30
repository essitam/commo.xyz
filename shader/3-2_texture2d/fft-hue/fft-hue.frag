precision mediump float;
#define PI 3.1415926538

// we need our texcoords for drawing textures
varying vec2 vTexCoord;

// images are sent to the shader as a variable type called sampler2D
uniform sampler2D cullTex;
uniform float ampFloat;
uniform vec3 bins;

void main() {
  // by default, our texcoords will be upside down
  // lets flip them by inverting the y component
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec4 cull = texture2D(cullTex, uv);
  //bluring edges
  cull.a = cull.a * pow(sin(PI*uv.x), 0.5) * pow(sin(PI*uv.y), 0.5);

  if(0.25<(cull.r-cull.g)){
    cull.a *= bins.x * abs(sin(PI*ampFloat/0.5));
  }
  if(0.25<(cull.b-cull.r)){
    cull.a *= bins.y * abs(sin(PI*ampFloat/0.5 - 0.25));
  }
  if(0.25<(cull.g-cull.b)){
    cull.a *= bins.z * abs(sin(PI*ampFloat/0.5 - 0.5));
  }

  gl_FragColor = cull;
}
