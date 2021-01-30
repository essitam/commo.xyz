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
  #define PI 3.1415926538

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_heading;

    vec2 tile(vec2 _st, float _zoom){
        _st *= _zoom;
        return fract(_st);
    }

    float box(vec2 _st, vec2 _size, float _smoothEdges){
        _size = vec2(0.5)-_size*0.5;
        vec2 aa = vec2(_smoothEdges*0.5);
        vec2 uv = smoothstep(_size,_size+aa,_st);
        uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
        return uv.x*uv.y;
    }

    vec3 grid (vec2 uv){
        //draw grid
        uv = tile(uv, 40.);
        vec3 squares = vec3(box(uv,vec2(0.99),0.1));
        return squares;
    }

    float draw_rect(vec2 posl, vec2 posr, vec2 st) {
        vec2 left = vec2(smoothstep(posl.x, posl.x+0.001, st.x), smoothstep(posl.y, posl.y+0.001, st.y));
        vec2 right = vec2(smoothstep(st.x, st.x+0.001, posr.x), smoothstep(st.y, st.y+0.001, posr.y));
        float resl = left.x * left.y;
        float resr = right.x * right.y;
        float res = resl*resr;
        res = 1.0-res;
        return res;
    }

    float icon (vec2 uv, vec2 pos, float scl){
        //rect
        float rect = draw_rect(
          vec2(0.2*scl + pos.x, 0.275*scl + pos.y),
          vec2(0.35*scl + pos.x, 0.725*scl + pos.y),
          vec2(uv.x, uv.y)
        );
        //circle
        float r = 0.225*scl;
        float d = length(vec2(0.575*scl + pos.x, 0.5*scl + pos.y)-uv);
        float c = smoothstep(d,d+0.001,r);
        //combine
        float icn = rect - c;
        //icn = 1.0-icn;
        return icn;
    }

    vec2 sig (vec2 hola, float amt){
        vec2 siggy = vec2( (amt*2.0)/(1.0+exp(-5.0*hola.x)) - amt, (amt*2.0)/(1.0+exp(-5.0*hola.y)) - amt);
        return siggy;
    }

    void main(void) {
          vec2 st = gl_FragCoord.xy/u_resolution.x;
          st.y = 1.0-st.y;
          vec2 head = vec2(-1.0*u_heading.x, -1.0*u_heading.y);
          //smooth input with sigmoid function
          head = sig(head, 0.30);
          vec2 ij = st;
          ij = ij + head;
          vec2 pr = vec2(0.0);
          vec2 gh = vec2(0.0);

          //limit smudge effect to region around mouse
          vec2 mouse = u_mouse;
          mouse.y -= (u_resolution.y-u_resolution.x)*(1.0/u_resolution.y);
          mouse.y *= u_resolution.y/u_resolution.x;
          vec2 diff = st - mouse;
          float dist = length(diff);
          float e = -1.0*pow(dist, 0.2) + 1.0;
          dist = smoothstep(0.5,1.0,-1.0*dist + 1.0);
          dist = dist*e*0.5;
          pr = mix(st, ij, dist);

          //exaggerate effect for icon
          float icn_dist = dist*3.0;
          gh = mix(st, ij, icn_dist);

          //grab pixel from grid & icon img
          vec4 color = vec4(grid(pr), 0.8);
          float vert = (u_resolution.y-u_resolution.x)/u_resolution.x;
          //horizontal position (0.1), scale (0.8)
          float ten = icon(gh, vec2(0.1, -1.0*vert), 0.8);
          color.xyz *= ten;
          if(ten<1.0){color.a = 1.0;}

          gl_FragColor = color;
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
