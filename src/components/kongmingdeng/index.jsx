/* eslint-disable no-debugger */
/* eslint-disable no-var */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
import city from "./img/苏州城夜景.jpg";
import light from "./img/孔明灯.png";
const imgList = {
  city,
  light,
};
console.log(imgList);

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    /**
     * 创建场景对象Scene
     */
    let scene = new window.THREE.Scene();
    this.textureLoader = new window.THREE.TextureLoader();
    // 轴辅助
    // let AxesHelper = new THREE.AxesHelper(100);
    // scene.add(AxesHelper);

    let SS = 1;
    let box = new THREE.SphereGeometry(25 * SS, 50 * SS, 50 * SS);
    let material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
    });
    let mesh = new THREE.Mesh(box, material);
    scene.add(mesh);
    let texture = this.textureLoader.load(imgList.city, function () {
      // render();
    });
    mesh.material.map = texture;

    let textureLight = this.textureLoader.load(imgList.light);
    let group = new THREE.Group();
    let L = 50;
    for (let i = 0; i < 800 * 3; i++) {
      let spriteMaterial = new THREE.SpriteMaterial({
        map: textureLight,
      });
      let sprite = new THREE.Sprite(spriteMaterial);
      group.add(sprite);
      sprite.scale.set(0.6, 0.75, 0.08);
      let k1 = Math.random() - 0.5;
      let k2 = Math.random() - 0.5;
      let k3 = Math.random() - 0.5;
      sprite.position.set(L * k1, L * k2, L * k3);
    }
    scene.add(group);

    /**
     * 光源设置
     */
    let point = new THREE.PointLight(0xffffff, 0.5);
    point.position.set(400, 200, 300);
    scene.add(point);
    /**
     * 相机设置
     */
    let width = window.innerWidth; //窗口宽度
    let height = window.innerHeight; //窗口高度
    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    this.camera.position.set(2.64, 1.56, -6.16);
    this.camera.lookAt(scene.position);
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象

    let clock = new THREE.Clock();
    let FPS = 30;
    let freshTime = 1 / FPS;
    let timeS = 0;
    function render() {
      let t = clock.getDelta();
      group.children.forEach((sprite) => {
        sprite.position.y += 50 * t * 0.02;
        if (sprite.position.y > 25) {
          let n = parseInt((sprite.position.y + 25) / 50);
          sprite.position.y = sprite.position.y - n * 50;
        }
      });
      timeS = timeS + t;
      if (timeS > freshTime) {
        renderer.render(scene, this.camera);
        scene.rotateY(0.003);
        timeS = 0;
      }
      requestAnimationFrame(render.bind(this));
    }
    render.call(this);
    let controls = new window.THREE.OrbitControls(
      this.camera,
      renderer.domElement
    ); //创建控件对象
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = 2 * Math.PI / 3;

    console.log(window.THREE, scene, controls);
  }

  render() {
    return <div id="three-board"></div>;
  }
}

export default Game;
