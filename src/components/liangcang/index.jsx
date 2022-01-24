/* eslint-disable no-debugger */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
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
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0x000000, 1);
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象

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
      renderer.render(scene, this.camera);
      requestAnimationFrame(render.bind(this));
      let deltaT = clock.getDelta();
      timeS = timeS + deltaT;
      if (timeS > T) {
        // composer.render();
        // labelRenderer.render(scene, camera);
        timeS = 0;
      }
    }
    render.call(this);
    let controls = new window.THREE.OrbitControls(
      this.camera,
      renderer.domElement
    ); //创建控件对象
    controls.enablePan = false;
    // controls.minZoom = 0.6;
    // controls.maxZoom = 3;

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
        let geometry = new THREE.PlaneGeometry(1000,1000);
        let texture = new THREE.TextureLoader().load(imgList.i1);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        let material = new THREE.MeshBasicMaterial({
            map: texture,
        });
        let mesh = new THREE.Mesh(geometry,material);
        scene.add(mesh);
        mesh.rotateX(-Math.PI / 2);
        mesh.position.y = -0.1
    }
    // 创建马路路面
    function createPlane2() {
        let textureLoader = new THREE.TextureLoader();
        let geometry = new THREE.PlaneGeometry(24,800);
        let texture = textureLoader.load(imgList.road2);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 10);
        let material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        let mesh = new THREE.Mesh(geometry,material);
        scene.add(mesh);
        mesh.rotateX(-Math.PI / 2);
        mesh.rotateZ(Math.PI / 2);
        mesh.position.z = 130 + 12
    }
    // 创建一圈树
    function createTree() {
        let group = new THREE.Group();
        let w = 190
          , h = 260;
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
                } else if (i * 10 === 0 || i * 10 === 190 || j * 10 === 0 || j * 10 === 260) {
                    let Sprite = sprite.clone();
                    Sprite.translateX(i * 10 - w / 2);
                    Sprite.translateZ(j * 10 - h / 2);
                    group.add(Sprite)
                }
            }
        }
        group.scale.set(0.96, 0.96, 0.98);
        scene.add(group)
    }
  }

  render() {
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
      </>
    );
  }
}

export default Game;
