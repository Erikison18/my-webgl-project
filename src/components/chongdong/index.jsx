/* eslint-disable no-debugger */
/* eslint-disable no-var */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    /**
     * 创建场景对象Scene
     */
    let scene = new window.THREE.Scene();
    // 轴辅助
    // let AxesHelper = new THREE.AxesHelper(100);
    // scene.add(AxesHelper);

    let curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(600, -600, 0),
      new THREE.Vector3(800, -400, 600),
      new THREE.Vector3(900, -100, 300),
      new THREE.Vector3(0, 100, 300),
      new THREE.Vector3(-700, 300, 600),
      new THREE.Vector3(-500, 200, 900),
      new THREE.Vector3(-100, 400, 400),
      new THREE.Vector3(-200, 200, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    let points = curve.getPoints(1000);
    console.log(points);
    let geometry = new THREE.TubeGeometry(curve, 400, 30, 30, true);
    let length = geometry.vertices.length;
    console.log(length);
    for (let i = 0; i < length; i++) {
      let color = new THREE.Color();
      color.setRGB(Math.random(), 1, (i < length / 2) ? (i * 2 / length) : (2 - i * 2 / length));
      geometry.colors.push(color);
    }
    let material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: THREE.VertexColors,
    });
    let point = new THREE.Points(geometry, material);
    scene.add(point);
    /**
     * 光源设置
     */
    /**
     * 相机设置
     */
    let width = window.innerWidth; //窗口宽度
    let height = window.innerHeight; //窗口高度
    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    // this.camera.position.set(0,0,10);
    // this.camera.lookAt(scene.position);
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象
    let i = 0;
    function render() {
      renderer.render(scene, this.camera);
      requestAnimationFrame(render.bind(this));
      if (i < points.length) {
        this.camera.position.set(points[i].x, points[i].y, points[i].z);
        let next = (i + 1) % points.length;
        this.camera.lookAt(
          new THREE.Vector3(points[next].x, points[next].y, points[next].z)
        );
        i += 1;
      } else {
        i = 0;
      }
    }
    render.call(this);
    // let controls = new window.THREE.OrbitControls(
    //   this.camera,
    //   renderer.domElement
    // ); //创建控件对象

    console.log(window.THREE, scene);
  }

  render() {
    return <div id="three-board"></div>;
  }
}

export default Game;
