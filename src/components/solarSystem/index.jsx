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
import 太阳1 from "./ui/太阳.png";
import 地球1 from "./ui/地球.png";
import 海王星1 from "./ui/海王星.png";
import 火星1 from "./ui/火星.png";
import 金星1 from "./ui/金星.png";
import 木星1 from "./ui/木星.png";
import 水星1 from "./ui/水星.png";
import 天王星1 from "./ui/天王星.png";
import 土星1 from "./ui/土星.png";
const imgList = {
  太阳: 太阳1,
  地球: 地球1,
  海王星: 海王星1,
  火星: 火星1,
  金星: 金星1,
  木星: 木星1,
  水星: 水星1,
  天王星: 天王星1,
  土星: 土星1,
};

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
    this.intersectsArr = [];
    let Data = this.data();
    // 创建太阳
    let sun = this.createSphereMesh(Data.sun.R, Data.sun.URL);
    sun.name = Data.sun.name;
    this.intersectsArr.push(sun);
    scene.add(sun);
    // 创建行星
    let planetGroup = new window.THREE.Group();
    Data.planet.forEach((obj) => {
      let planet = null;
      if (obj.ring) {
        planet = this.createringPlanetMesh(
          obj.sphere.R,
          obj.sphere.URL,
          obj.ring.r,
          obj.ring.R,
          obj.ring.URL
        );
        planet.children[0].name = obj.name;
        planet.children[0].revolutionR = obj.revolutionR;
        planet.children[0].angle = 2 * Math.PI * Math.random();
        this.intersectsArr.push(planet.children[0]);
      } else {
        planet = this.createSphereMesh(obj.R, obj.URL);
        this.intersectsArr.push(planet);
      }
      planet.revolutionR = obj.revolutionR;
      planet.angle = 2 * Math.PI * Math.random();
      planet.name = obj.name;
      planetGroup.add(planet);
      let line = this.circle(obj.revolutionR);
      scene.add(line);
    });
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
    let s = 300; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    this.camera = new window.THREE.OrthographicCamera(
      -s * k,
      s * k,
      s,
      -s,
      1,
      1500
    );
    this.camera.position.set(400, 200, 300); //设置相机位置
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
    //执行渲染操作   指定场景、相机作为参数
    this.chooseMesh = null;
    let clock = new THREE.Clock();
    let FPS = 30;
    let refreshTime = 1 / FPS;
    let timeS = 0;
    function render() {
      sun.rotation.y += 0.01;
      let deltaTime = clock.getDelta();
      timeS = timeS + deltaTime;
      if (timeS > refreshTime) {
        // 优化性能，超过最低30频率的时间间隔，才刷新
        renderer.render(scene, this.camera);
        timeS = 0;
      }
      planetGroup.children.forEach(function (obj) {
        obj.rotation.y += 0.01;
        obj.angle += (0.005 / obj.revolutionR) * 400;
        obj.position.set(
          obj.revolutionR * Math.sin(obj.angle),
          0,
          obj.revolutionR * Math.cos(obj.angle)
        );
      });
      cloud.rotation.x += 0.0002;
      cloud.rotation.y += 0.0002;
      cloud.rotation.z += 0.0002;

      requestAnimationFrame(render.bind(this));

      if (this.chooseMesh) {
        let worldVector = new THREE.Vector3(
          this.chooseMesh.position.x,
          this.chooseMesh.position.y,
          this.chooseMesh.position.z,
        );
        let standardVector = worldVector.project(this.camera);
        let a = window.innerWidth / 2;
        let b = window.innerHeight / 2;
        let x = Math.round(standardVector.x * a + a);
        let y = Math.round(-standardVector.y * b + b);

        this.img.style.left = x + 'px';
        this.img.style.top = y - 280 + 'px';
      }
    }
    render.call(this);
    let controls = new window.THREE.OrbitControls(this.camera, renderer.domElement); //创建控件对象

    this.img = document.createElement("img");
    this.img.style.position = "absolute";
    this.img.style.display = "block";
    document.body.appendChild(this.img);
    addEventListener('click', this.choose.bind(this));

    console.log(window.THREE, scene, controls);
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
      side: window.THREE.DoubleSide,
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
      color: 0xccffff,
    });
    let line = new window.THREE.LineLoop(geometry, material);
    line.rotateX(Math.PI / 2);
    return line;
  }
  choose(event) {
    this.img.src = '';
    this.chooseMesh = null;
    let Sx = event.clientX;
    let Sy = event.clientY;

    let x = (Sx / window.innerWidth) * 2 - 1;
    let y = -(Sy / window.innerHeight) * 2 + 1;

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    let intersects = raycaster.intersectObjects(this.intersectsArr, false);
    console.log(this.intersectsArr)
    console.log(intersects)
    if (intersects.length > 0) {
      console.log(intersects[0].object.name);
      this.img.src = imgList[intersects[0].object.name];
      if (intersects[0].object.name === "天王星" || intersects[0].object.name === "土星") {
        this.chooseMesh = intersects[0].object.parent
      } else {
        this.chooseMesh = intersects[0].object
      }
    }
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
