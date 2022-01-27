/* eslint-disable no-debugger */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
import i03 from "./img/03.jpg";
import px from "./img/px.jpg";
import nx from "./img/nx.jpg";
import py from "./img/py.jpg";
import ny from "./img/ny.jpg";
import pz from "./img/pz.jpg";
import nz from "./img/nz.jpg";

const imgList = {
  i03,
  px,
  nx,
  py,
  ny,
  pz,
  nz,
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scene: null,
      progressValue: 0,
      progressBool: true,
      bool: false,
      currentModel: null,
      left: 0,
      top: 0,
    };
  }

  componentDidMount() {
    /**
     * 创建场景对象Scene
     */
    let scene = new window.THREE.Scene();
    this.setState({ scene });
    // 轴辅助
    let AxesHelper = new THREE.AxesHelper(100);
    scene.add(AxesHelper);

    // let textureLoader = new THREE.TextureLoader();
    // let texture = textureLoader.load(imgList.i03);
    let loader = new THREE.FBXLoader();
    let MeshArr = [];
    let textureCube = new THREE.CubeTextureLoader().load(
      [imgList.px, imgList.nx, imgList.py, imgList.ny, imgList.pz, imgList.nz]
      // function () {
      //   render();
      // }
    );
    let SizeGroup = new THREE.Group();
    let treeData = [
      {
        id: "01010101",
        label: "千斤顶",
        mesh: null,
        children: [],
        viewBool: true,
      },
    ];
    let ModelGroup = new THREE.Group();
    loader.load(
      "./mechanicalAssembly/qianjinding.fbx",
      (obj) => {
        obj.rotateX(Math.PI / 2);
        treeData[0].mesh = obj;
        ModelGroup = obj;
        console.log(ModelGroup);
        obj.traverse(function (object) {
          if (object.type === "Mesh") {
            MeshArr.push(object);
            object.material = new THREE.MeshPhysicalMaterial({
              color: object.material.color,
              metalness: 1.0,
              roughness: 0.6,
              envMap: textureCube,
            });
            object.material.selfColor = new THREE.Color().copy(
              object.material.color
            );
          }
        });
        obj.children[0].children[0].name = "千斤顶";
        recursion(obj.children[0].children[0], treeData[0]);
        function recursion(obj, treeobj) {
          treeobj.id = obj.id;
          treeobj.label = obj.name;
          treeobj.mesh = obj;
          treeobj.children = [];
          treeobj.viewBool = true;
          let children = obj.children;
          let children2 = treeobj.children;
          for (let i = 0, l = children.length; i < l; i++) {
            children2[i] = {};
            recursion(children[i], children2[i]);
          }
        }
        let box3 = new THREE.Box3();
        box3.expandByObject(obj);
        let v3 = new THREE.Vector3();
        box3.getSize(v3);
        function num() {
          let max;
          if (v3.x > v3.y) {
            max = v3.x;
          } else {
            max = v3.y;
          }
          if (max > v3.z) {
            console.log(max);
          } else {
            max = v3.z;
          }
          return max;
        }
        let S = 150 / num();
        obj.scale.set(S, S, S);
        let newBox3 = new THREE.Box3();
        newBox3.expandByObject(obj);
        let center = new THREE.Vector3();
        newBox3.getCenter(center);
        obj.position.x = obj.position.x - center.x;
        obj.position.y = obj.position.y - center.y;
        obj.position.z = obj.position.z - center.z;
        let newV3 = new THREE.Vector3();
        newBox3.getSize(newV3);
        let Box3X = newV3.x + 5;
        let Box3Y = newV3.y + 5;
        let Box3Z = newV3.z + 5;
        let geometry = new THREE.BoxGeometry(Box3X, Box3Y, Box3Z);
        let material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.2,
        });
        let mesh = new THREE.Mesh(geometry, material);
        SizeGroup.add(mesh);
        let border = new THREE.BoxHelper(mesh, 0x0ed5c7);
        SizeGroup.add(border);
        let SizeLineX = this.SizeLine(Box3X);
        SizeLineX.position.y = Box3Y / 2 + 5;
        SizeLineX.position.z = -Box3Z / 2;
        SizeGroup.add(SizeLineX);
        let SizeLineY = this.SizeLine(Box3Y);
        SizeLineY.rotateZ(Math.PI / 2);
        SizeLineY.position.x = Box3X / 2 + 5;
        SizeLineY.position.z = -Box3Z / 2;
        SizeGroup.add(SizeLineY);
        let SizeLineZ = this.SizeLine(Box3Z);
        SizeLineZ.rotateY(Math.PI / 2);
        SizeLineZ.position.x = Box3X / 2;
        SizeLineZ.position.y = -Box3Y / 2 - 5;
        SizeGroup.add(SizeLineZ);
        this.sizeFun(Math.round(newV3.x), SizeLineX.position, "size1");
        this.sizeFun(Math.round(newV3.y), SizeLineY.position, "size2");
        this.sizeFun(Math.round(newV3.z), SizeLineZ.position, "size3");
        scene.add(obj);
        render();
      },
      onProgress.bind(this)
    );
    function onProgress(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      this.setState(
        {
          progressValue: Math.floor((xhr.loaded / xhr.total) * 100),
        },
        () => {
          if (this.state.progressValue >= 100) {
            this.setState({
              progressBool: false,
            });
          }
        }
      );
    }

    /**
     * 光源设置
     */
    let size = 200;
    let divisions = 25;
    let gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.position.y = -55;
    scene.add(gridHelper);
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(100, 350, 200);
    scene.add(directionalLight);
    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight2.position.set(-300, -100, -400);
    scene.add(directionalLight2);
    let directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight3.position.set(-10, -300, -30);
    scene.add(directionalLight3);
    let point = new THREE.PointLight(0xffffff, 0.9);
    point.position.set(400, 150, 300);
    scene.add(point);
    let ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    /**
     * 相机设置
     */
    let width = window.innerWidth - 200;
    let height = window.innerHeight - 60;
    let k = width / height;
    let s = 100;
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 20000);
    this.camera.position.set(226, 118, 319);
    this.camera.lookAt(scene.position);
    // scene2
    let scene2 = new THREE.Scene();
    let camera2 = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera2.position.set(226, 118, 319);
    camera2.lookAt(scene2.position);
    createViewMesh();
    function createViewMesh() {
      let geometry = new THREE.BoxGeometry(100, 100, 100);
      let material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
      });
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(100, 100, 0);
      scene2.add(mesh);
    }
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0x000000, 1);
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象

    // renderpass
    let renderPass = new THREE.RenderPass(scene, this.camera);
    let OutlinePass = new THREE.OutlinePass(
      new THREE.Vector2(width, height),
      scene,
      this.camera
    );
    OutlinePass.visibleEdgeColor = new THREE.Color(0, 1, 0);
    OutlinePass.hiddenEdgeColor = new THREE.Color(0, 1, 0);
    OutlinePass.edgeThickness = 3.0;
    let composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(OutlinePass);
    let FXAAShaderPass = new THREE.ShaderPass(THREE.FXAAShader);
    FXAAShaderPass.uniforms["resolution"].value.set(1 / width, 1 / height);
    FXAAShaderPass.renderToScreen = true;
    composer.addPass(FXAAShaderPass);
    let labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    document
      .getElementById("three-board")
      .appendChild(labelRenderer.domElement);

    function render() {
      // renderer.render(scene, this.camera);
      // requestAnimationFrame(render.bind(this));
      composer.render();
      labelRenderer.render(scene, this.camera);
    }
    render.call(this);
    // controls
    let controls = new window.THREE.OrbitControls(
      this.camera,
      renderer.domElement
    ); //创建控件对象
    controls.addEventListener("change", ()=> {
      let {bool, currentModel, left, top} = this.state;
      if (bool) {
        let worldPosition = new THREE.Vector3();
        currentModel = currentModel.getWorldPosition(worldPosition);
        let standardVector = worldPosition.project(camera);
        let a = (window.innerWidth - 200) / 2;
        let b = (window.innerHeight - 60) / 2;
        left = Math.round(standardVector.x * a + a) + 200;
        top = Math.round(-standardVector.y * b + b) - 140 + 60;
        this.setState({
          currentModel, left, top
        })
      }
      render.call(this);
    });
    // controls.enablePan = false;
    // controls.minZoom = 0.1;
    // controls.maxZoom = 10;

    console.log(window.THREE, scene, controls);
  }

  SizeLine(length) {
    let w = 10;
    let p10 = new THREE.Vector3(-length / 2, 0, 0);
    let p11 = new THREE.Vector3(-length / 2, w / 2, 0);
    let p12 = new THREE.Vector3(-length / 2, -w / 2, 0);
    let p20 = p10.clone().negate();
    let p21 = p11.clone().negate();
    let p22 = p12.clone().negate();
    let LineGroup = new THREE.Group();
    let lengthLine = createLine([p10, p20]);
    let leftLine = createLine([p11, p12]);
    let rightLine = createLine([p21, p22]);
    let p13 = new THREE.Vector3(-length / 2 + 2, 2, 0);
    let p14 = new THREE.Vector3(-length / 2 + 2, -2, 0);
    let p23 = p13.clone().negate();
    let p24 = p14.clone().negate();
    let leftRowLine = createLine([p13, p10, p14]);
    let rightRowLine = createLine([p23, p20, p24]);
    LineGroup.add(lengthLine, leftLine, rightLine, leftRowLine, rightRowLine);
    return LineGroup;
    function createLine(pointArr) {
      let material = new THREE.LineBasicMaterial({
        color: 0xffffff,
      });
      let geometry = new THREE.Geometry();
      geometry.vertices = pointArr;
      let line = new THREE.Line(geometry, material);
      return line;
    }
  }
  sizeFun(length, pos, id) {
    let { scene } = this.state;
    let text = document.getElementById(id);
    text.style.visibility = "hidden";
    text.style.fontSize = "20px";
    text.style.color = "#ffffff";
    text.style.padding = "5px 10px";
    text.style.background = "rgba(0,0,0,0.9)";
    text.className = "label";
    text.textContent = "" + length;
    let label = new THREE.CSS2DObject(text);
    label.position.copy(pos);
    scene.add(label);
  }

  render() {
    return <div id="three-board"></div>;
  }
}

export default Game;
