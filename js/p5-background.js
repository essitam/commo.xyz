function setup(){
  var canv = createCanvas(windowWidth, windowHeight);
  canv.parent('backg');
}
function draw(){

  // noStroke();
  fill(214, 202, 40);
  stroke(253, 243, 76);
  triangle(mouseX, mouseY, 58, 20, 86, 75);
}
