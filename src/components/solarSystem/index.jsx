/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
import 太阳 from "./img/太阳.jpg";
import 地球 from "./img/地球.jpg";
import 海王星 from "./img/海王星.jpg";
import 火星 from "./img/火星.jpg";
import 金星 from "./img/金星.jpg";
import 木星 from "./img/木星.jpg";
import 水星 from "./img/水星.jpg";
import 天王星 from "./img/天王星.jpg";
import 天王星环 from "./img/天王星环.jpg";
import 土星 from "./img/土星.jpg";
import 土星环 from "./img/土星环.jpg";

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    /**
     * 创建场景对象Scene
     */
    let scene = new window.THREE.Scene();
    this.texLoader = new window.THREE.TextureLoader();
    let cloud = this.cloudFun(); //星云
    scene.add(cloud);
    let intersectsArr = [];
    let Data = this.data()
    // 创建太阳
    let sun = this.createSphereMesh(Data.sun.R, Data.sun.URL);
    sun.name = Data.sun.name;
    intersectsArr.push(sun)
    scene.add(sun)
    // 创建行星
    let planetGroup = new window.THREE.Group();
    Data.planet.forEach((obj)=> {
      let planet = null;
      if (obj.ring) {
        planet = this.createringPlanetMesh(obj.sphere.R, obj.sphere.URL, obj.ring.r, obj.ring.R, obj.ring.URL)
      } else {
        planet = this.createSphereMesh(obj.R, obj.URL);
      }
      planet.revolutionR = obj.revolutionR;
      planet.angle = 2 * Math.PI * Math.random();
      planet.name = obj.name;
      planetGroup.add(planet);
      intersectsArr.push(planet)
      let line = this.circle(obj.revolutionR);
      scene.add(line);
    })
    console.log(planetGroup);
    scene.add(planetGroup);
    /**
     * 光源设置
     */
    let point = new window.THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300);
    scene.add(point);
    let ambient = new window.THREE.AmbientLight(0x444444);
    scene.add(ambient);
    /**
     * 相机设置
     */
    let width = window.innerWidth; //窗口宽度
    let height = window.innerHeight; //窗口高度
    let k = width / height; //窗口宽高比
    let s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    let camera = new window.THREE.OrthographicCamera(
      -s * k,
      s * k,
      s,
      -s,
      1,
      1500
    );
    camera.position.set(400, 200, 300); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0x101010, 1); //设置背景颜色
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象
    //执行渲染操作   指定场景、相机作为参数
    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera); //执行渲染操作
    }
    render();

    let controls = new window.THREE.OrbitControls(camera, renderer.domElement); //创建控件对象
    controls.addEventListener("change", render); //监听鼠标、键盘事件

    console.log(window.THREE, scene)
  }
  // 创造星云
  cloudFun() {
    let geom = new window.THREE.Geometry();
    let material = new window.THREE.ParticleBasicMaterial({
      size: 2,
      vertexColors: true,
    });
    let n = 1200;
    for (let i = 0; i < 3000; i++) {
      let particle = new window.THREE.Vector3(
        (Math.random() - 0.5) * n,
        (Math.random() - 0.5) * n,
        (Math.random() - 0.5) * n
      );
      geom.vertices.push(particle);
      let color_k = Math.random();
      geom.colors.push(new window.THREE.Color(color_k, color_k, color_k * 0.6));
    }

    let cloud = new window.THREE.ParticleSystem(geom, material);
    return cloud;
  }
  // 创建球体
  createSphereMesh(R, URL) {
    let geometry = new window.THREE.SphereGeometry(R, 100, 100);
    return this.createMesh(geometry, URL);
  }
  // 创建Mesh
  createMesh(geometry, URL) {
    let material = new window.THREE.MeshBasicMaterial({
      map: this.texLoader.load(URL),
      side:window.THREE.DoubleSide,
    });
    let mesh = new window.THREE.Mesh(geometry, material);
    return mesh;
  }
  createRingMesh(r, R, URL) {
    let geometry = new THREE.CylinderGeometry(r, R, 0, 100, 100, true);
    return this.createMesh(geometry, URL);
  }
  createringPlanetMesh(sphere_R, sphere_URL, ring_r, ring_R, ring_URL) {
    let group = new THREE.Group();
    let spere = this.createSphereMesh(sphere_R, sphere_URL);
    let ring = this.createRingMesh(ring_r, ring_R, ring_URL);
    group.add(spere, ring);
    return group;
  }
  circle(r) {
    let arc = new THREE.ArcCurve(0, 0, r, 0, 2 * Math.PI, true);
    let points = arc.getPoints(50);
    let geometry = new THREE.Geometry();
    geometry.setFromPoints(points);
    let material = new window.THREE.LineBasicMaterial({
      color: 0xccffff
    });
    let line = new window.THREE.LineLoop(geometry, material);
    line.rotateX(Math.PI / 2);
    return line;
  }
  // 星球数据
  data() {
    let K = 5;
    return {
      sun: {
        name: "太阳",
        R: 10 * K,
        URL: 太阳,
      },
      planet: [
        {
          name: "水星",
          R: 2.5 * K,
          URL: 水星,
          revolutionR: 20 * K,
        },
        {
          name: "金星",
          R: 3 * K,
          URL: 金星,
          revolutionR: 30 * K,
        },
        {
          name: "地球",
          R: 3.2 * K,
          URL: 地球,
          revolutionR: 40 * K,
        },
        {
          name: "火星",
          R: 2.5 * K,
          URL: 火星,
          revolutionR: 50 * K,
        },
        {
          name: "木星",
          R: 5 * K,
          URL: 木星,
          revolutionR: 60 * K,
        },
        {
          name: "土星",
          sphere: {
            R: 3.5 * K,
            URL: 土星,
          },
          ring: {
            r: 4 * K,
            R: 6 * K,
            URL: 土星环,
          },
          revolutionR: 70 * K,
        },
        {
          name: "天王星",
          sphere: {
            R: 3.5 * K,
            URL: 天王星,
          },
          ring: {
            r: 4 * K,
            R: 6 * K,
            URL: 天王星环,
          },
          revolutionR: 80 * K,
        },
        {
          name: "海王星",
          R: 4 * K,
          URL: 海王星,
          revolutionR: 100 * K,
        },
      ],
      ringPlanet: [],
      moon: {
        R: K,
        URL: "tu.png",
        revolutionR: 10 * K,
      },
    };
  }

  render() {
    return <div id="three-board"></div>;
  }
}

export default Game;
