<template>
  <div class="about" ref="pfg" style="background:#666">
    <br />
    <p>
      <button type="button" @click="up()">UP</button>
      <button type="button" @click="down()">DOWN</button>
    </p>
    <canvas id="webgl" ref="webgl" width="400" height="400" style="background:#000">
      please
    </canvas>
    <br />
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
function main() {
  // Retrieve <canvas> element
  let canvas = document.getElementById('webgl')

  // Get the rendering context for WebGL
  let gl = getWebGLContext(canvas)
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
  let n = initVertexBuffers(gl)
  gl.clearColor(0, 0, 0, 1)
  //
  if (n < 0) {
    console.log('Failed to set the positions of the vertices')
    return
  }

  // Create Matrix4 object for the rotation matrix

  // Pass the rotation matrix to the vertex shader
  let u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix')
    return
  }
  let xformMatrix = new Matrix4()
  // const onmousedown = () => {
  //   // Set the rotation matrix
  //   ANGLE += 10
  //   xformMatrix.setRotate(ANGLE, 0, 0, 1)
  //   gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements)
  //   // Clear <canvas>
  //   // Draw the rectangle
  //   gl.clear(gl.COLOR_BUFFER_BIT)
  //   gl.drawArrays(gl.TRIANGLES, 0, n)
  // }
  // onmousedown()
  // setInterval(() => {
  //   onmousedown()
  // }, 500)
  let currentAngle = 0.0
  let tick = function() {
    currentAngle = animate(currentAngle) // Update the rotation angle
    draw(gl, n, currentAngle, xformMatrix, u_xformMatrix) // Draw the triangle
    requestAnimationFrame(tick, canvas) // Request that the browser calls tick
  }
  tick()
  // Specify the color for clearing <canvas>
}

// Last time that this function was called
let g_last = Date.now()
let ANGLE_STEP = 45.0
function animate(angle) {
  // Calculate the elapsed time
  let now = Date.now()
  let elapsed = now - g_last
  g_last = now
  // Update the current rotation angle (adjusted by the elapsed time)
  let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0
  return (newAngle %= 360)
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  // Set the rotation matrix
  modelMatrix.setRotate(currentAngle, 0, 0, 1) // Rotation angle, rotation axis (0, 0, 1)
  modelMatrix.translate(0.35, 0, 0)
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)
  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffers(gl) {
  let vertices = new Float32Array([0, 0.2, -0.2, -0.2, 0.2, -0.2])
  let n = 3 // The number of vertices

  // Create a buffer object
  let vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object')
    return false
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
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
  methods: {
    down() {
      ANGLE_STEP -= 10
    },
    up() {
      ANGLE_STEP += 10
    }
  },
  mounted() {
    main()
  }
}
</script>

<style lang="scss" scoped>
</style>