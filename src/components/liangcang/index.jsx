/* eslint-disable no-debugger */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
import { Switch, notification } from "antd";
import lan2 from "./img/lan2.png";
import door from "./img/door.png";
import d001 from "./img/d001.png";
import 红豆 from "./img/红豆.png";
import 青色弹窗 from "./img/青色弹窗.png";
import 白色弹窗 from "./img/白色弹窗.png";
import i002 from "./img/002.png";
import 绿豆 from "./img/绿豆.png";
import i003 from "./img/003.png";
import 黄豆 from "./img/黄豆.png";
import rain from "./img/rain.png";
import floor3 from "./img/floor3.png";
import i1 from "./img/door.png";
import road2 from "./img/road2.png";
import i0 from "./img/0.png";
import flame from "./img/flame.png";
import m2 from "./img/2.png";
import t2 from "./img/tempotate.png";

const imgList = {
  lan2,
  door,
  d001,
  红豆,
  青色弹窗,
  白色弹窗,
  i002,
  绿豆,
  i003,
  黄豆,
  rain,
  floor3,
  i1,
  road2,
  i0,
  flame,
  m2,
  t2,
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchBool: true,
      clipBool: true,
      tagBool: true,
      rainBool: true,
      AllGroup: null,
      scene: null,
      RainGroup: null,
      renderer: null,
      OutlinePass: null,
      lastMesh: null,
      clickBool: false,
      left: 500,
      top: 500,
      currentMesh: {
        name: "",
        仓高: 0,
        粮高: 0,
        谷物: "",
        温度: 0,
        吨位: 0,
      },
      S: 0,
    };
  }

  componentDidMount() {
    addEventListener("click", this.choose.bind(this));
    /**
     * 创建场景对象Scene
     */
    let scene = new window.THREE.Scene();
    this.setState({ scene }, ()=> {
      // 初始化火情
      this.initFire(20, 40, 20, 30, 0);
    });
    // 轴辅助
    let AxesHelper = new THREE.AxesHelper(500);
    scene.add(AxesHelper);

    /**
     * 光源设置
     */
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(50, 250, 500);
    scene.add(directionalLight);
    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-400, -400, -400);
    scene.add(directionalLight2);
    let ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    /**
     * 相机设置
     */
    let width = window.innerWidth;
    let height = window.innerHeight;
    let k = width / height;
    let s = 100;
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 20000);
    this.camera.position.set(314, 202, 243);
    this.camera.lookAt(scene.position);
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.localClippingEnabled = true;
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0x000000, 1);
    this.setState({ renderer });
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象\
    // CSS2D
    let labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    document.body.appendChild(labelRenderer.domElement);

    let renderPass = new THREE.RenderPass(scene, this.camera);
    let OutlinePass = new THREE.OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      this.camera
    );
    OutlinePass.visibleEdgeColor = new THREE.Color(0, 1, 0);
    OutlinePass.hiddenEdgeColor = new THREE.Color(0, 1, 0);
    OutlinePass.edgeThickness = 3.0;
    let composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(OutlinePass);
    this.setState({ OutlinePass });
    let FXAAShaderPass = new THREE.ShaderPass(THREE.FXAAShader);
    FXAAShaderPass.renderToScreen = true;
    FXAAShaderPass.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    composer.addPass(FXAAShaderPass);

    window.onresize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      k = window.innerWidth / window.innerHeight;
      this.camera.left = -s * k;
      this.camera.right = s * k;
      this.camera.top = s;
      this.camera.bottom = -s;
      this.camera.updateProjectionMatrix();
      // this.location.reload()
    };

    /**
     * 添加模型
     */
    // let textureLoader = new THREE.TextureLoader();
    // let texture = textureLoader.load('./img/0.jpg');
    // scene.background = texture;
    let group1 = new THREE.Group();
    let group2 = new THREE.Group();
    let group3 = new THREE.Group();
    group1.position.set(-40, 0, -105);
    group2.position.set(-40, 0, -25);
    group3.position.set(+10, 0, -85);
    let AllGroup = new THREE.Group();
    AllGroup.add(group1, group2, group3);
    scene.add(AllGroup);
    this.setState({ AllGroup });

    let treeData = [
      {
        id: group1.id,
        label: "立筒仓",
        children: [],
      },
      {
        id: group1.id,
        label: "浅圆仓",
        children: [],
      },
      {
        id: group1.id,
        label: "平房仓",
        children: [],
      },
    ];

    let OBJLoader = new THREE.OBJLoader();
    OBJLoader.load("./liangcang/wall.obj", function (obj) {
      obj.scale.set(0.98, 0.6, 1);
      let texLan = new THREE.TextureLoader().load(imgList.lan2);
      texLan.wrapS = THREE.RepeatWrapping;
      texLan.wrapT = THREE.RepeatWrapping;
      texLan.repeat.set(40, 1);
      obj.children[0].material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        map: texLan,
        transparent: true,
      });
      obj.children[1].material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(imgList.door),
        side: THREE.DoubleSide,
        transparent: true,
      });
      scene.add(obj);
    });
    OBJLoader.load("./liangcang/gong001.obj", function (obj) {
      let mesh = obj.children[0];
      mesh.rotateZ(Math.PI);
      mesh.translateY(-36);
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
          let Mesh = mesh.clone();
          Mesh.material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(imgList.d001),
            transparent: true,
            side: THREE.DoubleSide,
            clipIntersection: true,
          });
          Mesh.编号 = "L-" + (i + 1) * (j + 1);
          Mesh.name = "立筒仓 L-" + (i + 1) * (j + 1);
          Mesh.translateX(i * 26);
          Mesh.translateZ(j * 21);
          Mesh.rotateY(Math.PI / 6);
          group1.add(Mesh);
          Mesh.仓高 = 36;
          Mesh.粮高 = (15 * Math.random() + 20).toFixed(1);
          Mesh.谷物 = "红豆";
          Mesh.温度 = (36 * (Math.random() / 10 + 0.9)).toFixed(1);
          Mesh.吨位 = Mesh.粮高 * 200;
          Mesh.iconpath = imgList.红豆;
          let geometry2 = new THREE.CylinderGeometry(
            8 - 0.2,
            8 - 0.2,
            Mesh.粮高,
            25
          );
          let material2 = new THREE.MeshLambertMaterial({
            color: 0xb63427,
          });
          let mesh2 = new THREE.Mesh(geometry2, material2);
          Mesh.add(mesh2);
          mesh2.translateY(36 - Mesh.粮高 / 2);
          let text = document.getElementById("label").cloneNode(true);
          text.style.visibility = "hidden";
          text.className = "label";
          text.childNodes[0].childNodes[0].textContent = Mesh.name;
          let label = new THREE.CSS2DObject(text);
          label.position.copy(Mesh.position);
          group1.add(label);
          treeData[0].children.push({
            id: Mesh.id,
            mesh: Mesh,
            label: Mesh.name,
            children: [],
          });
        }
      }
    });
    OBJLoader.load("./liangcang/002.obj", function (obj) {
      let mesh = obj.children[0];
      mesh.rotateZ(Math.PI);
      mesh.material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(imgList.i002),
        side: THREE.DoubleSide,
        transparent: true,
        clipIntersection: true,
      });
      mesh.translateY(-20);
      mesh.translateZ(5);
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 6; j++) {
          let Mesh = mesh.clone();
          Mesh.material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(imgList.i002),
            transparent: true,
            side: THREE.DoubleSide,
            clipIntersection: true,
          });
          Mesh.编号 = "Q-" + (i + 1) * (j + 1);
          Mesh.name = "浅圆仓 Q-" + (i + 1) * (j + 1);
          Mesh.translateX(i * 25);
          Mesh.translateZ(j * 24);
          Mesh.rotateY(Math.PI / 6);
          group2.add(Mesh);
          Mesh.仓高 = 20;
          Mesh.粮高 = (10.9 * Math.random() + 9).toFixed(1);
          Mesh.谷物 = "绿豆";
          Mesh.温度 = (36 * (Math.random() / 10 + 0.9)).toFixed(1);
          Mesh.吨位 = Mesh.粮高 * 400;
          Mesh.iconpath = imgList.绿豆;
          let geometry2 = new THREE.CylinderGeometry(
            10 - 0.2,
            10 - 0.2,
            Mesh.粮高,
            25
          );
          let material2 = new THREE.MeshLambertMaterial({
            color: 0x91a337,
          });
          let mesh2 = new THREE.Mesh(geometry2, material2);
          Mesh.add(mesh2);
          mesh2.translateY(20 - Mesh.粮高 / 2);
          let text = document.getElementById("label").cloneNode(true);
          text.style.visibility = "hidden";
          text.className = "label";
          text.childNodes[0].childNodes[0].textContent = Mesh.name;
          let label = new THREE.CSS2DObject(text);
          label.position.copy(Mesh.position);
          group2.add(label);
          treeData[1].children.push({
            id: Mesh.id,
            mesh: Mesh,
            label: Mesh.name,
            children: [],
          });
        }
      }
    });
    OBJLoader.load("./liangcang/003.obj", function (obj) {
      let mesh = obj.children[0];
      mesh.translateZ(2);
      mesh.translateX(1);
      mesh.material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(imgList.i003),
        transparent: true,
        side: THREE.DoubleSide,
        clipIntersection: true,
      });
      mesh.scale.set(1.3, 1.4, 1.5);
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
          let Mesh = mesh.clone();
          Mesh.material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(imgList.i003),
            transparent: true,
            side: THREE.DoubleSide,
          });
          Mesh.编号 = "P-" + (i + 1) * (j + 1);
          Mesh.name = "平房仓 P-" + (i + 1) * (j + 1);
          Mesh.translateX(i * 52.5);
          Mesh.translateZ(j * 81.6);
          group3.add(Mesh);
          Mesh.仓高 = 8;
          Mesh.粮高 = (4.9 * Math.random() + 3).toFixed(1);
          Mesh.谷物 = "黄豆";
          Mesh.温度 = (36 * (Math.random() / 10 + 0.9)).toFixed(1);
          Mesh.吨位 = Mesh.粮高 * 1000;
          Mesh.iconpath = imgList.黄豆;
          let geometry2 = new THREE.BoxGeometry(
            21 - 0.2,
            Mesh.粮高,
            40 - 0.2,
            25
          );
          let material2 = new THREE.MeshLambertMaterial({
            color: 0xe99147,
          });
          let mesh2 = new THREE.Mesh(geometry2, material2);
          Mesh.add(mesh2);
          mesh2.translateY(Mesh.粮高 / 2);
          let text = document.getElementById("label3").cloneNode(true);
          text.style.visibility = "hidden";
          text.className = "label";
          text.childNodes[0].childNodes[0].textContent = Mesh.name;
          let label = new THREE.CSS2DObject(text);
          label.position.copy(Mesh.position);
          group3.add(label);
          treeData[2].children.push({
            id: Mesh.id,
            mesh: Mesh,
            label: Mesh.name,
            children: [],
          });
        }
      }
    });

    let RainGroup = new THREE.Group();
    for (let i = 0; i < 500; i++) {
      let spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load(imgList.rain),
      });
      let sprite = new THREE.Sprite(spriteMaterial);
      RainGroup.add(sprite);
      sprite.scale.set(3.2, 4, 1);
      let k1 = Math.random() - 0.5;
      let k2 = Math.random() - 0.5;
      sprite.position.set(500 * k1, 200 * Math.random(), 500 * k2);
    }
    for (let i = 0; i < 500; i++) {
      let spriteMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load(imgList.rain),
      });
      let sprite = new THREE.Sprite(spriteMaterial);
      RainGroup.add(sprite);
      sprite.scale.set(2.4, 3, 1);
      let k1 = Math.random() - 0.5;
      let k2 = Math.random() - 0.5;
      sprite.position.set(500 * k1, 200 * Math.random(), 500 * k2);
    }
    this.setState({ RainGroup });
    // scene.add(RainGroup);

    let clock = new THREE.Clock();
    let FPS = 30;
    let T = 1 / FPS;
    let timeS = 0;
    let i = 0;
    scene.rotateY(-0.3);
    function render() {
      i += 1;
      if (i < 300) {
        scene.rotateY(0.001);
      }
      RainGroup.children.forEach((sprite) => {
        sprite.position.y -= 0.5;
        if (sprite.position.y < 0) {
          sprite.position.y = 200;
        }
      });
      // renderer.render(scene, this.camera);
      requestAnimationFrame(render.bind(this));
      let deltaT = clock.getDelta();
      timeS = timeS + deltaT;
      if (timeS > T) {
        composer.render();
        labelRenderer.render(scene, this.camera);
        timeS = 0;
      }
    }
    render.call(this);
    let controls = new window.THREE.OrbitControls(
      this.camera,
      renderer.domElement
    ); //创建控件对象
    controls.enablePan = false;
    controls.minZoom = 0.6;
    controls.maxZoom = 3;

    console.log(window.THREE, scene, controls);

    createPlane();
    createPlane1();
    createPlane2();
    createTree();

    // 创建粮仓地面
    function createPlane() {
      let geometry = new THREE.PlaneGeometry(270, 260);
      let texture = new THREE.TextureLoader().load(imgList.floor3);
      let material = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      mesh.rotateX(-Math.PI / 2);
      mesh.position.y = -0.01;
    }
    // 创建草地地面
    function createPlane1() {
      let geometry = new THREE.PlaneGeometry(1000, 1000);
      let texture = new THREE.TextureLoader().load(imgList.i1);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
      let material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      mesh.rotateX(-Math.PI / 2);
      mesh.position.y = -0.1;
    }
    // 创建马路路面
    function createPlane2() {
      let textureLoader = new THREE.TextureLoader();
      let geometry = new THREE.PlaneGeometry(24, 800);
      let texture = textureLoader.load(imgList.road2);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 10);
      let material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      mesh.rotateX(-Math.PI / 2);
      mesh.rotateZ(Math.PI / 2);
      mesh.position.z = 130 + 12;
    }
    // 创建一圈树
    function createTree() {
      let group = new THREE.Group();
      let w = 190,
        h = 260;
      let textureTree = new THREE.TextureLoader().load(imgList.i0);
      let spriteMaterial = new THREE.SpriteMaterial({
        map: textureTree,
      });
      let sprite = new THREE.Sprite(spriteMaterial);
      let H = 8;
      sprite.scale.set(4, H, 1);
      sprite.translateY(H / 2);
      for (let i = 0; i < 19 + 1; i++) {
        for (let j = 0; j < 26 + 1; j++) {
          if (j * 10 === 260 && i * 10 > 100 && i * 10 < 160) {
            console.log("no tree");
          } else if (
            i * 10 === 0 ||
            i * 10 === 190 ||
            j * 10 === 0 ||
            j * 10 === 260
          ) {
            let Sprite = sprite.clone();
            Sprite.translateX(i * 10 - w / 2);
            Sprite.translateZ(j * 10 - h / 2);
            group.add(Sprite);
          }
        }
      }
      group.scale.set(0.96, 0.96, 0.98);
      scene.add(group);
    }
  }

  onChange0(checked) {
    this.setState({ switchBool: checked });

    let { AllGroup } = this.state;
    if (checked) {
      AllGroup.children.forEach(function (group) {
        group.children.forEach(function (mesh) {
          if (mesh.type === "Mesh") {
            mesh.material.visible = true;
          }
        });
      });
    } else {
      AllGroup.children.forEach(function (group) {
        group.children.forEach(function (mesh) {
          if (mesh.type === "Mesh") {
            mesh.material.visible = false;
          }
        });
      });
    }
  }
  onChange1(checked) {
    this.setState({ tagBool: checked });

    if (checked) {
      let arr = document.getElementsByClassName("label");
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.visibility = "hidden";
      }
    } else {
      let arr = document.getElementsByClassName("label");
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.visibility = "visible";
      }
    }
  }
  onChange2(checked) {
    this.setState({ rainBool: checked });

    let { scene, RainGroup } = this.state;
    if (checked) {
      scene.remove(RainGroup);
    } else {
      scene.add(RainGroup);
    }
  }
  onChange3(checked) {
    this.setState({ clipBool: checked });

    let { renderer } = this.state;
    if (checked) {
      renderer.localClippingEnabled = true;
    } else {
      renderer.localClippingEnabled = false;
    }
  }

  choose(event) {
    let { lastMesh, left, top, AllGroup, OutlinePass, scene } = this.state;
    console.log("choose", event);
    if (lastMesh) {
      this.setState({ clickBool: false });
      lastMesh.material.clippingPlanes = null;
      OutlinePass.selectedObjects = [];
    }
    // 计算转换位置
    let Sx = event.clientX;
    let Sy = event.clientY;
    left = Sx + 20;
    top = Sy + 20;
    this.setState({ left, top });
    let x = (Sx / window.innerWidth) * 2 - 1;
    let y = -(Sy / window.innerHeight) * 2 + 1;
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    let intersects = raycaster.intersectObjects(AllGroup.children, true);
    // 点击有选中
    if (intersects.length > 0) {
      let mesh = intersects[0].object;
      OutlinePass.selectedObjects = [mesh];
      let S = this.state.currentMesh.吨位;
      this.setState({ clickBool: true, currentMesh: mesh, S: 0 });
      // 数字滚动效果
      let startTime = new Date().getTime();
      let interval = setInterval(() => {
        let { S: SState } = this.state;
        if (new Date().getTime() - startTime > (S / 58) * 6) {
          clearInterval(interval);
          return;
        }
        if (SState < S) {
          SState += 58;
          this.setState({ S: SState + 58 });
          // console.log(SState);
        }
      }, 6);
      scene.updateMatrixWorld(true);
      let worldPosition = new THREE.Vector3();
      mesh.getWorldPosition(worldPosition);
      this.setState({ lastMesh: mesh });
      // 剖切面
      let PlaneArr = [
        new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1),
        new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
      ];
      PlaneArr[0].constant = worldPosition.x;
      PlaneArr[1].constant = worldPosition.z;
      mesh.material.clipIntersection = true;
      mesh.material.clippingPlanes = PlaneArr;
    }
  }

  // initFire(20, 40, 20, 30, 0);
  initFire(w, h, posX, posY, posZ) {
    let { scene } = this.state;
    function random(min, max, precision) {
      let p = Math.pow(10, precision);
      return Math.round((min + Math.random() * (max - min)) * p) / p;
    }
    let fireVertexShader = document.getElementById("vertexShaderLC").innerText;
    let fireFragmentShader =
      document.getElementById("fragmentShaderLC").innerText;
    let _geometry, _shader, _mesh, _group;
    let _num = 12;
    let _x = new THREE.Vector3(1, 0, 0);
    let _y = new THREE.Vector3(0, 1, 0);
    let _z = new THREE.Vector3(0, 0, 1);
    let _tipTarget = new THREE.Vector3();
    let _tip = new THREE.Vector3();
    let _diff = new THREE.Vector3();
    let _quat = new THREE.Quaternion();
    let _quat2 = new THREE.Quaternion();
    (function () {
      initGeometry();
      initInstances();
      initShader();
      initMesh();
      requestAnimationFrame(loop);
    })();
    function initGeometry() {
      _geometry = new THREE.InstancedBufferGeometry();
      _geometry.maxInstancedCount = _num;
      let shape = new THREE.PlaneBufferGeometry(w, h);
      shape.translate(0, 0.4, 0);
      let data = shape.attributes;
      _geometry.addAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(data.position.array), 3)
      );
      _geometry.addAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array(data.uv.array), 2)
      );
      _geometry.addAttribute(
        "normal",
        new THREE.BufferAttribute(new Float32Array(data.normal.array), 3)
      );
      _geometry.setIndex(
        new THREE.BufferAttribute(new Uint16Array(shape.index.array), 1)
      );
      shape.dispose();
    }
    function initInstances() {
      let orientation = new THREE.InstancedBufferAttribute(
        new Float32Array(_num * 4),
        4
      );
      let randoms = new THREE.InstancedBufferAttribute(
        new Float32Array(_num),
        1
      );
      let scale = new THREE.InstancedBufferAttribute(
        new Float32Array(_num * 2),
        2
      );
      let life = new THREE.InstancedBufferAttribute(new Float32Array(_num), 1);
      for (let i = 0; i < _num; i++) {
        orientation.setXYZW(i, 0, 0, 0, 1);
        life.setX(i, i / _num + 1);
      }
      _geometry.addAttribute("orientation", orientation);
      _geometry.addAttribute("scale", scale);
      _geometry.addAttribute("life", life);
      _geometry.addAttribute("random", randoms);
    }
    function initShader() {
      let uniforms = {
        uMap: {
          type: "t",
          value: null,
        },
        uColor1: {
          type: "c",
          value: new THREE.Color(0x961800),
        },
        uColor2: {
          type: "c",
          value: new THREE.Color(0x4b5828),
        },
        uTime: {
          type: "f",
          value: 0,
        },
      };
      _shader = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: fireVertexShader,
        fragmentShader: fireFragmentShader,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      let textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        imgList.flame,
        (t) => (_shader.uniforms.uMap.value = t)
      );
    }
    function initMesh() {
      _group = new THREE.Group();
      _mesh = new THREE.Mesh(_geometry, _shader);
      _mesh.frustumCulled = false;
      _group.add(_mesh);
      scene.add(_group);
      _mesh.scale.set(0.01, 0.01, 0.01);
      setTimeout(function () {
        _mesh.scale.set(1, 1, 1);
        notification.error({
          message: "火警",
          description: "平房仓 P-2失火报警",
          duration: 3,
        });
      }, 3000);
      setTimeout(function () {
        notification.info({
          message: "自动灭火",
          description: "自动灭火器开启预计1分内完成无需119",
          duration: 3,
        });
      }, 5000);
      let startTime = new Date().getTime();
      let interval = setInterval(function () {
        if (new Date().getTime() - startTime > 10 * 1000) {
          notification.success({
            message: "成功",
            description: "已完成灭火，用时10s",
            duration: 3,
          });
          scene.remove(_group);
          clearInterval(interval);
          return;
        }
      }, 200);
      // _fire = _group;
    }
    function loop(e) {
      requestAnimationFrame(loop);
      _shader.uniforms.uTime.value = e * 0.001;
      let life = _geometry.attributes.life;
      let orientation = _geometry.attributes.orientation;
      let scale = _geometry.attributes.scale;
      let randoms = _geometry.attributes.random;
      for (let i = 0; i < _num; i++) {
        let value = life.array[i];
        value += 0.04;
        if (value > 1) {
          value -= 1;
          _quat.setFromAxisAngle(_y, random(0, 3.14, 3));
          _quat2.setFromAxisAngle(_x, random(-1, 1, 2) * 0.1);
          _quat.multiply(_quat2);
          _quat2.setFromAxisAngle(_z, random(-1, 1, 2) * 0.3);
          _quat.multiply(_quat2);
          orientation.setXYZW(i, _quat.x, _quat.y, _quat.z, _quat.w);
          scale.setXY(i, random(0.8, 1.2, 3), random(0.8, 1.2, 3));
          randoms.setX(i, random(0, 1, 3));
        }
        life.setX(i, value);
      }
      life.needsUpdate = true;
      orientation.needsUpdate = true;
      scale.needsUpdate = true;
      randoms.needsUpdate = true;
      _group.position.x = posX;
      _group.position.y = posY;
      _group.position.z = posZ;
      let tipOffset = 0.4;
      _tipTarget.copy(_group.position);
      _tipTarget.y += tipOffset;
      _tip.lerp(_tipTarget, 0.1);
      _diff.copy(_tip);
      _diff.sub(_group.position);
      let length = _diff.length();
      _group.scale.y = (length / tipOffset - 1) * 0.4 + 1;
      _group.quaternion.setFromUnitVectors(_y, _diff.normalize());
    }
  }

  render() {
    let { currentMesh, clickBool, left, top, S } = this.state;
    return (
      <>
        <div id="three-board"></div>
        <div id="label" className="label">
          <div>
            <div></div>
            <div>
              <img src={imgList.青色弹窗} alt="" />
            </div>
          </div>
        </div>
        <div id="label3" className="label3">
          <div>
            <div></div>
            <div>
              <img src={imgList.白色弹窗} alt="" />
            </div>
          </div>
        </div>
        <div className="hud">
          <div className="el-switch">
            <Switch defaultChecked onChange={this.onChange0.bind(this)} />
            隐藏粮仓
          </div>
          <div className="el-switch">
            <Switch defaultChecked onChange={this.onChange1.bind(this)} />
            显示标签
          </div>
          <br />
          <div className="el-switch">
            <Switch defaultChecked onChange={this.onChange2.bind(this)} />
            天气可视
          </div>
          <div className="el-switch">
            <Switch defaultChecked onChange={this.onChange3.bind(this)} />
            关闭剖切
          </div>
        </div>
        {clickBool ? (
          <div id="tan" style={{ left: left + "px", top: top + "px" }}>
            <div className="tan-1">
              <div className="tan-1-1">
                <img src={imgList.m2} alt="" />
              </div>
              <div className="tan-1-2">{currentMesh.name}</div>
              <div className="tan-1-3">
                <img src={imgList.t2} alt="" />
              </div>
              <div className="tan-1-4">{currentMesh.温度} ℃</div>
              <div className="tan-1-5">{currentMesh.谷物}(吨)</div>
              <div className="tan-1-6">
                <img src={currentMesh.iconpath} alt="" />
              </div>
              <div className="tan-1-7">{Math.floor(S)}t</div>
              <div className="tan-1-8">仓高—{currentMesh.仓高} m</div>
              <div className="tan-1-9">粮高—{currentMesh.粮高} m</div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default Game;
