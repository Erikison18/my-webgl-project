import React from "react";
import "./index.scss";

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Get A WebGL context
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("experimental-webgl");

    // setup a GLSL program
    let program = window.webglUtils.createProgramFromScripts(gl, [
      "2d-vertex-shader",
      "2d-fragment-shader",
    ]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    let positionLocation = gl.getAttribLocation(program, "a_position");

    let colorLocation = gl.getUniformLocation(program, "u_color");

    // Create a buffer and put a single clipspace rectangle in
    // it (2 triangles)
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
    //   new Float32Array([
    //     -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    //   ]),
    //   gl.STATIC_DRAW
    // );

    // set the resolution
    let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    // setup a rectangle from 10,20 to 80,30 in pixels
    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
    //   new Float32Array([10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30]),
    //   gl.STATIC_DRAW
    // );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // draw 50 random rectangles in random colors
    for (let ii = 0; ii < 50; ++ii) {
      // Setup a random rectangle
      setRectangle(
        gl,
        randomInt(300),
        randomInt(300),
        randomInt(300),
        randomInt(300)
      );

      // Set a random color.
      gl.uniform4f(
        colorLocation,
        Math.random(),
        Math.random(),
        Math.random(),
        1
      );

      // Draw the rectangle.
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // Returns a random integer from 0 to range - 1.
    function randomInt(range) {
      return Math.floor(Math.random() * range);
    }

    // Fills the buffer with the values that define a rectangle.
    function setRectangle(gl, x, y, width, height) {
      let x1 = x;
      let x2 = x + width;
      let y1 = y;
      let y2 = y + height;
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
        gl.STATIC_DRAW
      );
    }

    // draw
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  render() {
    return (
      <div className="shadow">
        <canvas id="canvas"></canvas>
      </div>
    );
  }
}

export default Game;
