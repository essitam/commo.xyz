let cullShader;
let source;
var fr = 30; //frame rate for the animation, max 60

function preload(){
  // load the shader
  cullShader = loadShader('moire/uniform.vert', 'moire/uniform.frag');
  source = loadImage('../../assets/commo-official-flipped.png');
}

function setup() {
  frameRate(fr);
  // shaders require WEBGL mode to work
  let cnv = createCanvas(windowWidth/2, windowWidth/2, WEBGL);
  cnv.parent('myContainer');
  noStroke();
}

function draw() {
  clear();

  // cullShader.setUniform('uSampler', source);
  // // cullShader.setUniform('mouse', [mouseX/width, mouseY/height]);
  // cullShader.setUniform('time', millis()/1000);
  // cullShader.setUniform('amplitude', 0.05 + Math.max(0, 0.03*Math.cos(0.001*millis())));
  // cullShader.setUniform('amplitudeY', Math.max(0, 0.02*Math.sin(0.001*millis())));
  // cullShader.setUniform('frequency', 10 + 2 * Math.sin(0.0007*millis()));
  // cullShader.setUniform('speed', 2.0);
  cullShader.setUniform('uSampler', source);
  // cullShader.setUniform('mouse', [mouseX/width, mouseY/height]);
  cullShader.setUniform('time', millis()/1000);
  cullShader.setUniform('amplitude', 0.02 + Math.max(0, 0.02*Math.sin(0.001*millis())));
  cullShader.setUniform('amplitudeY', Math.max(0, 0.01*Math.sin(0.001*millis())));
  cullShader.setUniform('frequency', 10 + 2 * Math.sin(0.0007*millis()));
  cullShader.setUniform('speed', 1.0);

  shader(cullShader);

  // rect gives us some geometry on the screen
  rect(0,0,windowWidth/2, windowWidth/2);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
