// a shader variable
let theShader;
// Vertex shader program
const vsSource = `
  attribute vec4 aVertexPosition;

  void main(void) {
    gl_Position = aVertexPosition;
  }
`;
//Fragment shader program
const fsSource = `
precision mediump float;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float time;
uniform float frequency;
uniform float amplitude;
uniform float amplitudeY;
uniform float speed;

void main() {
  vec2 position = vTextureCoord;
  float distortion = sin(position.y * frequency + time * speed) * amplitude;
  float distortion2 = sin(position.y * frequency + time * speed) * amplitudeY;
  gl_FragColor = texture2D(uSampler, vec2(position.x + distortion, position.y + distortion2));
}
`;

function preload(){
  // load the shader
  theShader = loadShader(vsSource, fsSource);
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  // shader() sets the active shader with our shader
  shader(theShader);

  // rect gives us some geometry on the screen
  rect(0,0,width,height);

  // print out the framerate
  //  print(frameRate());
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
