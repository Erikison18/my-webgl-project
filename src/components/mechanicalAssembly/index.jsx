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
    let AxesHelper = new THREE.AxesHelper(100);
    scene.add(AxesHelper);

    /**
     * 光源设置
     */
    let directionalLight = new THREE.DirectionalLight(0xffffff,0.7);
    directionalLight.position.set(50, 250, 500);
    scene.add(directionalLight);
    let directionalLight2 = new THREE.DirectionalLight(0xffffff,0.5);
    directionalLight2.position.set(-400, -400, -400);
    scene.add(directionalLight2);
    let ambient = new THREE.AmbientLight(0xffffff,0.6);
    scene.add(ambient);
    /**
     * 相机设置
     */
     let width = window.innerWidth;
     let height = window.innerHeight;
     let k = width / height;
     let s = 100;
     this.camera = new THREE.OrthographicCamera(-s * k,s * k,s,-s,1,20000);
     this.camera.position.set(314, 202, 243);
     this.camera.lookAt(scene.position);
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0x000000, 1);
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象
    function render() {
      renderer.render(scene, this.camera);
      requestAnimationFrame(render.bind(this));
    }
    render.call(this);
    let controls = new window.THREE.OrbitControls(
      this.camera,
      renderer.domElement
    ); //创建控件对象

    console.log(window.THREE, scene, controls);
  }

  render() {
    return <div id="three-board"></div>;
  }
}

export default Game;
