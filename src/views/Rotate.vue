<template>
  <div class="about" ref="pfg" style="background:#666">
    <canvas id="webgl" ref="webgl" width="400" height="400" style="background:#f00">
      please
    </canvas>
  </div>
</template>

<script>
import { getWebGLContext, initShaders } from "../assets/js/cuon-utils";
// RotatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_xformMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_xformMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// The rotation angle
let ANGLE = 90.0; 
let rate = 0.1;
let add = true
function click(e, gl, u_xformMatrix, n){
  ANGLE += 10
  if(add){
    rate += 0.1
  }else{
    rate -= 0.1
  }

  if(rate >= 2.0){
    add = false
  }

  if( rate <=0.1 ){
    add = true
  }
  
  var matrix = new Float32Array([
      rate, 0.0, 0.0, 0.0,
      0.0,  rate, 0.0, 0.0,
      0.0,  0.0, rate, 0.0,
      0.0, 0.0, 0.0, 1.0
  ]);
  gl.uniformMatrix4fv(u_xformMatrix, false, matrix);
  console.log('mat', matrix)
  gl.clearColor(0, 0, 0, 1);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  let n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  // Write the positions of vertices to a vertex shader u_xformMatrix
  let u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  // let u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_CosB or u_SinB');
    return;
  }

  // // Pass the data required to rotate the shape to the vertex shader
  canvas.onmousedown = (e)=>{
    click(e, gl, u_xformMatrix, n)
  }
   click(null, gl, u_xformMatrix, n)
}

function initVertexBuffers(gl) {
  let vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);
  let n = 3; // The number of vertices

  // Create a buffer object
  let vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}

    export default {
        mounted () {
            main();
        },
    }
</script>

<style lang="scss" scoped>

</style>