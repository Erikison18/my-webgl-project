/* eslint-disable no-debugger */
/* eslint-disable no-var */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
import g from "./img/g.png";
import o from "./img/o.png";
import w from "./img/w.png";
import t1 from "./img/t1.png";
import t2 from "./img/t2.png";
import t3 from "./img/t3.png";
const imgList = {
  g: g,
  o: o,
  w: w,
  t1: t1,
  t2: t2,
  t3: t3,
};
console.log(imgList);

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
    // let AxesHelper = new THREE.AxesHelper(1000);
    // scene.add(AxesHelper);

    // let textureLoader = new THREE.TextureLoader();
    // let textureMap = textureLoader.load(imgList.t1);
    // let textureMap1 = textureLoader.load(imgList.t2);
    // let textureMap2 = textureLoader.load(imgList.t3);

    let geometry = new THREE.TorusGeometry(1, 0.15, 50, 200);
    let material = new THREE.MeshBasicMaterial({
      //MeshLambertMaterial\MeshPhongMaterial
      transparent: true,
      opacity: 0,
      color: 0xFF6666
      // map: textureMap, // 普通纹理贴图
    });
    let material1 = new THREE.MeshBasicMaterial({
      //MeshLambertMaterial\MeshPhongMaterial
      transparent: true,
      opacity: 0,
      color: 0x99CC00
      // map: textureMap1, // 普通纹理贴图
    });
    let material2 = new THREE.MeshBasicMaterial({
      //MeshLambertMaterial\MeshPhongMaterial
      transparent: true,
      opacity: 0,
      color: 0xFFFF99
      // map: textureMap2, // 普通纹理贴图
    });

    let torus = new THREE.Mesh(geometry, material);
    torus.name = "mesh1";
    this.group = new THREE.Group;
    this.group.add(torus);

    let torus1 = new THREE.Mesh(geometry, material1);
    torus1.name = "mesh2";
    this.group.add(torus1);

    let torus2 = new THREE.Mesh(geometry, material2);
    torus2.name = "mesh3";
    this.group.add(torus2);

    scene.add(this.group);
    console.log(this.group);

    // 添加动画
    let posTrack = new THREE.KeyframeTrack("mesh1.material.opacity",[0, 3, 6, 7],[0, 1, 1, 0]);
    let posTrack1 = new THREE.KeyframeTrack("mesh2.material.opacity",[7, 8, 11, 12],[0, 1, 1, 0]);
    let posTrack2 = new THREE.KeyframeTrack("mesh3.material.opacity",[12, 13, 15, 16],[0, 1, 1, 0]);
    let clip = new THREE.AnimationClip("default",16,[posTrack, posTrack1, posTrack2]);
    let mixer = new THREE.AnimationMixer();
    let AnimationAction = mixer.clipAction(clip, this.group);
    AnimationAction.play();
    /**
     * 光源设置
     */
    let point = new THREE.PointLight(0xffffff);
    point.position.set(0, 20, 0);
    scene.add(point);
    let ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);
    /**
     * 相机设置
     */
    let width = window.innerWidth;
    let height = window.innerHeight;
    let k = width / height;
    let s = 4;
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);
    this.camera.position.set(0, 0, 800);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: 0,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0x1111111, 1);
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象

    let clock = new THREE.Clock();
    let FPS = 30;
    let freshTime = 1 / FPS;
    let timeS = 0;
    function render() {
      var deltaTime = clock.getDelta();
      timeS = timeS + deltaTime;
      mixer.update(deltaTime);
      this.group.rotateY(0.01);
      if (timeS > freshTime) {
        renderer.render(scene, this.camera);
        timeS = 0;
      }
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
    return (
      <div>
        <div id="three-board"></div>
        <div className="operate"></div>
      </div>
    );
  }
}

export default Game;
