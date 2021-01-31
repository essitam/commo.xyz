function setup(){
  var canv = createCanvas(windowWidth, windowHeight);
  canv.parent('backg');
}
function draw(){

  noStroke();
  fill(213, 227, 200)
  triangle(mouseX, mouseY, 58, 20, 86, 75);
}
