<template>
  <div class="about" ref="pfg" style="background:#666">
    <canvas ref="my-canvas" width="400" height="400" style="background:#f00">
      please
    </canvas>
  </div>
</template>

<script>
const VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n'+
  'attribute float a_y;\n'+
  'void main() {\n' +
  '  gl_Position = a_Position;\n' + // vec4(-0.50, 0.0, -1.0, 10.0) Set the vertex coordinates of the point
  '  gl_PointSize = 1.0;\n' +                    // Set the point size
  '}\n';

// Fragment shader program
const FSHADER_SOURCE =
  'precision mediump float;\n'+
  'uniform vec4 u_FragColor ;\n'+
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' + // Set the point color
  '}\n';
  //
function initVertexBuffers(gl) {
    // 三个点的坐标(x,y)
  var vertices = new Float32Array([
      -0.5, 0.5,
      -0.5, -0.5,
      0.5, 0.5,
      0.5, -0.5
      
  ]);
  var n = 4; // The number of vertices 顶点的个数，两个数字代表一个顶点
  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  // vertexAttrib3f
  gl.vertexAttribPointer(a_Position, 2/*分量数*/, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  return n;
}

import { getWebGLContext, initShaders } from "../assets/js/cuon-utils";
export default {
  data() {
    return {
      g_points:[],
      g_colors:[]
    }
  },
  methods: {},
  mounted() {
    const canvas = this.$refs["my-canvas"];
    if (canvas) {
      const gl = getWebGLContext(canvas);
      // canvas.getContext("2d");
      // ctx.fillStyle = "rgba(0,0,255,1.0)"; // 设置填充颜色
      // ctx.fillRect(120, 120, 100, 150); // 使用填充颜色填充矩形 x, y width height
      if (gl) {
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
          console.log('Failed to intialize shaders.');
          return;
        }
        // 获取attribute 变量的存储位置
        let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
        let u_Position = gl.getUniformLocation(gl.program, 'u_FragColor')
        // let a_y = gl.getAttribLocation(gl.program, 'a_y')
        if(!u_Position){
            return
        }
        if(a_Position <0){
          console.log('a_y error.')
          return;
        }
        const n = initVertexBuffers(gl)
        if(n < 0){
            return
        }
        gl.uniform4fv(u_Position, new Float32Array([0.0, 1.0, 0.0, 1.0]))
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);
        console.log(n)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
        // Draw a point
        // gl.drawArrays(gl.POINTS, 0, 4);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
