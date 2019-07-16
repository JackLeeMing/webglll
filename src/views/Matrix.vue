<template>
  <div class="about" ref="pfg" style="background:#666">
    <canvas id="webgl" ref="webgl" width="400" height="400" style="background:#f00">
      please
    </canvas>
  </div>
</template>

<script>
import { getWebGLContext, initShaders } from '../assets/js/cuon-utils.js'
import { Matrix4 } from '../assets/js/cuon-matrix.js'
// RotatedTriangle_Matrix4.js (c) 2012 matsuda
// Vertex shader program
// 顶点着色器
const VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_xformMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_xformMatrix * a_Position;\n' +
  '}\n'

// Fragment shader program
// 片元着色器
const FSHADER_SOURCE =
  'void main() {\n' + '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + '}\n'
let ANGLE = 90.0 // The rotation angle
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl')

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas)
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL')
    return
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.')
    return
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl)
  if (n < 0) {
    console.log('Failed to set the positions of the vertices')
    return
  }

  // Create Matrix4 object for the rotation matrix

  // Pass the rotation matrix to the vertex shader
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix')
    return
  }

  canvas.onmousedown = () => {
    let xformMatrix = new Matrix4()
    // Set the rotation matrix
    ANGLE += 10
    xformMatrix.setRotate(ANGLE, 0, 0, 1)
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements)
    gl.clearColor(0, 0, 0, 1)
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT)
    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n)
  }

  canvas.onmousedown()

  // Specify the color for clearing <canvas>
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5])
  var n = 3 // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object')
    return false
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position')
    return -1
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position)

  return n
}

export default {
  mounted() {
    main()
  }
}
</script>

<style lang="scss" scoped>
</style>