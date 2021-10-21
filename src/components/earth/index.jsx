/* eslint-disable no-var */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
import 大气 from "./img/大气2.png";
import 噪声 from "./img/噪声.png";
import Earth from "./img/Earth.png";
import EarthNormal from "./img/EarthNormal.png";
import EarthSpec from "./img/EarthSpec.png";
import light from "./img/light.png";
const imgList = {
  大气: 大气,
  噪声: 噪声,
  Earth: Earth,
  EarthNormal: EarthNormal,
  EarthSpec: EarthSpec,
  light: light,
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
    // 添加边环
    this.group = new THREE.Group();
    let textureSprite = new THREE.TextureLoader().load(imgList.light);
    let spriteMaterial = new THREE.SpriteMaterial({
      map: textureSprite,
      transparent: true,
      opacity: 1,
    });
    let sprite = new THREE.Sprite(spriteMaterial);
    this.group.add(sprite);
    sprite.scale.set(245, 245, 1);
    // 添加地球
    let box = new THREE.SphereGeometry(100, 100, 100);
    let texture = this.textureLoader.load(imgList.Earth.png);
    let textureNormal = this.textureLoader.load(imgList.EarthNormal);
    let textureSpecular = this.textureLoader.load(imgList.EarthSpec);
    let material = new THREE.MeshPhongMaterial({
      map: texture,
      normalMap: textureNormal,
      normalScale: new THREE.Vector2(2.9, 2.9),
      specularMap: textureSpecular,
      transparent: true,
      opacity: 0.7,
    });
    let mesh = new THREE.Mesh(box, material);
    this.group.add(mesh);
    // 添加大气
    let box2 = new THREE.SphereGeometry(100.001, 100, 100);
    let texture1 = this.textureLoader.load(imgList.噪声);
    let texture2 = this.textureLoader.load(imgList.大气2);
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    let uniforms = {
      time: {
        value: 1,
      },
      texture1: {
        value: texture1,
      },
      texture2: {
        value: texture2,
      },
      opacity: {
        value: 0.4,
      },
    };
    let material2 = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
      transparent: true,
    });
    let mesh2 = new THREE.Mesh(box2, material2);
    this.group.add(mesh2);
    scene.add(this.group);
    // 添加动画
    let posTrack = new THREE.KeyframeTrack(".scale",[0, 10],[0.01, 0.01, 0.01, 1, 1, 1]);
    let clip = new THREE.AnimationClip("default",10,[posTrack]);
    let mixer = new THREE.AnimationMixer();
    let AnimationAction = mixer.clipAction(clip, this.group);
    AnimationAction.loop = THREE.LoopOnce;
    AnimationAction.clampWhenFinished = true;
    AnimationAction.play();
    /**
     * 光源设置
     */
    let directionalLight = new THREE.DirectionalLight(0x777215, 0.9);
    directionalLight.position.set(400, 200, 300);
    scene.add(directionalLight);
    let directionalLight2 = new THREE.DirectionalLight(0x777215, 0.9);
    directionalLight2.position.set(-400, -200, -300);
    scene.add(directionalLight2);
    let ambient = new THREE.AmbientLight(0x777215, 0.6);
    scene.add(ambient);
    /**
     * 相机设置
     */
    let width = window.innerWidth; //窗口宽度
    let height = window.innerHeight; //窗口高度
    let k = width / height; //窗口宽高比
    let s = 100; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    this.camera = new window.THREE.OrthographicCamera(
      -s * k,
      s * k,
      s,
      -s,
      1,
      1500
    );
    this.camera.position.set(0, 100, 200); //设置相机位置
    this.camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0x101010, 1); //设置背景颜色
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象

    let clock = new THREE.Clock();
    function render() {
      let delta = clock.getDelta();
      uniforms.time.value += delta;
      mixer.update(delta);
      this.group.rotation.y -= 0.005;
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
