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
  // x' = x cosβ - y sinβ
  // y' = x sinβ + y cosβ　Equation 3.3
  // z' = z
  'attribute vec4 a_Position;\n' +
  'uniform  mat4 u_xformMatrix;\n' +
  'void main() {\n' +
  'gl_Position = u_xformMatrix * a_Position;\n'
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// The rotation angle
let ANGLE = 90.0; 
function click(e, gl, u_xformMatrix){
  ANGLE += 10
  let n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  let radian = Math.PI * ANGLE / 180.0; // Convert to radians
  let cosB = Math.cos(radian);
  let sinB = Math.sin(radian);
  gl.uniformMatrix4fv(u_xformMatrix, new Float32Array([
    cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0,
  ]));
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
  // Write the positions of vertices to a vertex shader
  let u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  // let u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_CosB or u_SinB');
    return;
  }

  // // Pass the data required to rotate the shape to the vertex shader
  canvas.onmousedown = (e)=>{
    click(e, gl, u_xformMatrix)
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Draw the rectangle
  // gl.drawArrays(gl.TRIANGLES, 0, n);
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