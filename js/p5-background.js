function setup(){
  var canv = createCanvas(windowWidth, windowHeight);
  canv.parent('backg');
}
function draw(){

  // noStroke();
  stroke(90, 107, 74);
  fill(213, 227, 200)
  triangle(mouseX, mouseY, 58, 20, 86, 75);
}
