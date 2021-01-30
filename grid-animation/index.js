var mousePos = new Float32Array(2);
mousePos[0]=0.0;
mousePos[1]=0.0;
var centerX = null;
var centerY = null;
var accelX = 0.0, accelY = 0.0;
var deltaX = 0.0, deltaY = 0.0;
var springing = 0.001, damping = 0.97;
var intensity = 500.0;

main();

function main() {

  const canvas = document.querySelector('#glcanvas');
  const ctn = document.querySelector('#container');
  canvas.width = ctn.getBoundingClientRect().width;

  const gl = canvas.getContext('webgl');

  window.addEventListener('resize', resizeCanvas, false);
  canvas.addEventListener( 'mousemove', updateMousePosition, false );
  canvas.addEventListener('touchmove', updateTouchPosition, false);


  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
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

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      resolution: gl.getUniformLocation(shaderProgram, 'u_resolution'),
      mousePos: gl.getUniformLocation(shaderProgram, 'u_mouse'),
      mouseHeading: gl.getUniformLocation(shaderProgram, 'u_heading')
    },
  };

  const buffers = initBuffers(gl);

  function updateMousePosition(e){
    var rect = canvas.getBoundingClientRect();
    mousePos[0] = (e.pageX - rect.left - window.scrollX)/rect.width;
    mousePos[1] = (e.pageY - rect.top - window.scrollY)/rect.height;
    if (centerX === null || centerY ===null){
      centerX = mousePos[0];
      centerY = mousePos[1];
      console.log('init');
    }
  }

  function updateTouchPosition(e){
    var rect = canvas.getBoundingClientRect();
    var touch = e.changedTouches[0];
    mousePos[0] = (touch.pageX - rect.left - window.scrollX)/rect.width;
    mousePos[1] = (touch.pageY - rect.top - window.scrollY)/rect.height;
    if (centerX === null || centerY ===null){
      centerX = mousePos[0];
      centerY = mousePos[1];
      console.log('init');
    }
  }

  function resizeCanvas(){
    var w = ctn.getBoundingClientRect().width;
    canvas.width = w;
  }

  // Draw the scene repeatedly
  function render() {
    drawScene(gl, programInfo, buffers);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}


// Initialize buffers
function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
     1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
    -1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return { position: positionBuffer, };
}

function moveShape() {
 //calculate displacement from mouse
 deltaX = mousePos[0]-centerX;
 deltaY = mousePos[1]-centerY;
 // create springing effect
 deltaX *= springing;
 deltaY *= springing;
 accelX += deltaX*1.5;
 accelY += deltaY*1.5;
 // move center
 centerX += accelX;
 centerY += accelY;
 // slow down springing
 accelX *= damping;
 accelY *= damping;
 }


// Draw the scene.
function drawScene(gl, programInfo, buffers) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  gl.useProgram(programInfo.program);

  //calculate offset with physics engine
  if(centerX != null && centerY != null){
      moveShape();
  }
  // Set shader uniforms
  gl.uniform2fv(programInfo.uniformLocations.resolution, [gl.canvas.width, gl.canvas.height]);
  gl.uniform2fv(programInfo.uniformLocations.mousePos, [mousePos[0], mousePos[1]]);
  gl.uniform2fv(programInfo.uniformLocations.mouseHeading, [deltaX*intensity, deltaY*intensity]);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}


// Initialize a shader program
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
