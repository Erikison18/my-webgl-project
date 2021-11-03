/* eslint-disable no-debugger */
/* eslint-disable no-var */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
import imgsrc from "./风格/中式/客餐厅/00125.jpg";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    /**
     * 创建场景对象Scene
     */
    let scene = new window.THREE.Scene();
    // 轴辅助
    let AxesHelper = new THREE.AxesHelper(1000);
    scene.add(AxesHelper);
    // 添加模型
    let box = new THREE.SphereGeometry(25, 50, 50);
    let material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
    });
    let mesh = new THREE.Mesh(box, material);
    scene.add(mesh);
    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load(
      imgsrc,
    );
    mesh.material.map = texture;
    /**
     * 光源设置
     */
    let ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);
    /**
     * 相机设置
     */
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(-0.87, 0.03, 0.4);
    this.camera.lookAt(scene.position);
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: 0,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象

    let clock = new THREE.Clock();
    let FPS = 30;
    let refreshTime = 1 / FPS;
    let timeS = 0;
    function render() {
      requestAnimationFrame(render.bind(this));
      let deltaTime = clock.getDelta();
      timeS = timeS + deltaTime;
      if (timeS > refreshTime) {
        renderer.render(scene, this.camera);
        mesh.rotateY(0.002);
        timeS = 0;
      }
    }
    render.call(this);

    let controls = new window.THREE.OrbitControls(
      this.camera,
      renderer.domElement
    ); //创建控件对象

    console.log(window.THREE, scene, controls);
  }

  render() {
    return (
      <div>
        <div id="three-board"></div>
      </div>
    );
  }
}

export default Game;
