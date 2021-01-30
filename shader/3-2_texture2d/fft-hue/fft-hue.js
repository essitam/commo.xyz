let cullShader;
let source;
var fr = 30; //frame rate for the animation, max 60

function preload(){
  // load the shader
  cullShader = loadShader('fft-hue/uniform.vert', 'fft-hue/fft-hue.frag');
  source = loadImage('assets/cull5.png');
}

function setup() {
  frameRate(fr);
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  clear();

  var low = bins.slice(0, 5).reduce(function(a, b){
        return a + b;
    }, 0);

  var mid = bins.slice(5, 10).reduce(function(a, b){
        return a + b;
    }, 0);

  var high = bins.slice(10, 15).reduce(function(a, b){
        return a + b;
    }, 0);

  var bins2frag = [round(low/5, 2), round(mid/5, 2), round(high/5, 2)];

  cullShader.setUniform('cullTex', source);
  cullShader.setUniform('ampFloat', level);
  cullShader.setUniform('bins', bins2frag);

  shader(cullShader);

  // rect gives us some geometry on the screen
  rect(0,0,windowWidth, windowHeight);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
