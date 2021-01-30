let leftShader, algaeShader, rightShader;
let source;
var windowSine = 6; //number of images that overlap at once, must be between 1 & 8
var fr = 20; //frame rate for the animation, max 60
var imgBufs = [];
var ssIndex = 0;

function preload(){
  // load the shader
  algaeShader = loadShader('fft-smoothflip/uniform.vert', 'fft-smoothflip/fft.frag');
  source = loadImage('assets/algae_large.jpeg');
}

function setup() {
  frameRate(fr);
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  for(let j=0; j<sqrt(9); j++){
    for(let i=0; i<sqrt(9); i++){
      imgBufs[ssIndex] = source.get(
        floor(i*source.width/sqrt(9)),
        floor(j*source.height/sqrt(9)),
        floor(source.width/sqrt(9)),
        floor(source.height/sqrt(9))
      );
      imgBufs[i].loadPixels();
      ssIndex++;
    }
  }

}

function draw() {

  clear();

  //level is tone.meter amplitude follower output
  var flip = constrain(level*9, 1.0, 7.999);
  var zero2three = bins.slice(0, 4);

  var j = floor(flip) -1; //sin((PI/4)*(flip-j));
  var k = floor(flip) + 1; //sin((PI/4)*(flip-k));
  var i = floor(flip); //sin((PI/4)*(flip-i));

      algaeShader.setUniform('leftBuf', imgBufs[i]);
      algaeShader.setUniform('midBuf', imgBufs[i+1]);
      algaeShader.setUniform('rightBuf', imgBufs[i+2]);
      algaeShader.setUniform('leftFloat', 0.7);//sin((PI/windowSine)*(flip-j)) );
      algaeShader.setUniform('midFloat', 1.0);//sin((PI/windowSine)*(flip-i)) );
      algaeShader.setUniform('rightFloat', 0.7);//sin((PI/windowSine)*(flip-k)) );
      algaeShader.setUniform('fftBinValues', zero2three);
      shader(algaeShader);

  // rect gives us some geometry on the screen
  rect(0,0,windowWidth, windowHeight);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
