/* eslint-disable no-debugger */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
import { Select, Modal, Tree, Progress } from "antd";
import i0 from "./img/0.png";
import i03 from "./img/03.jpg";
import i1 from "./img/1.png";
import px from "./img/px.jpg";
import nx from "./img/nx.jpg";
import py from "./img/py.jpg";
import ny from "./img/ny.jpg";
import pz from "./img/pz.jpg";
import nz from "./img/nz.jpg";

const { Option } = Select;
const imgList = {
  i0,
  i03,
  i1,
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
      options: [
        {
          value: "千斤顶",
          label: "千斤顶",
        },
        {
          value: "燃油管",
          label: "燃油管",
        },
        {
          value: "润滑油管",
          label: "润滑油管",
        },
        {
          value: "燃烧室",
          label: "燃烧室",
        },
        {
          value: "角接触轴承",
          label: "角接触轴承",
        },
      ],
      length: 0,
      treeData: [],
      selectedKeys: [],
      MeshArr: [],
      SizeBool: true,
      SizeGroup: null,
      scene: null,
      progressValue: 0,
      progressBool: true,
      bool: false,
      currentModel: null,
      left: 0,
      top: 0,
      ModelName: "",
      cxtmenu: {
        left: 400,
        top: 400,
        bool: false,
      },
    };
  }

  componentDidMount() {
    /**
     * 创建场景对象Scene
     */
    let scene = new window.THREE.Scene();
    this.setState({ scene }, () => {
      this.renderWebGL.call(this);
    });
    // 轴辅助
    let AxesHelper = new THREE.AxesHelper(200);
    AxesHelper.position.y = -54;
    scene.add(AxesHelper);

    // let textureLoader = new THREE.TextureLoader();
    // let texture = textureLoader.load(imgList.i03);
    let loader = new THREE.FBXLoader();
    let MeshArr = [];
    let textureCube = new THREE.CubeTextureLoader().load(
      [imgList.px, imgList.nx, imgList.py, imgList.ny, imgList.pz, imgList.nz],
      () => {
        this.renderWebGL();
      }
    );
    let SizeGroup = new THREE.Group();
    let treeData = [
      {
        key: "01010101",
        title: "千斤顶",
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
          treeobj.key = obj.id;
          treeobj.title = obj.name;
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
        // 边界面
        let mesh = new THREE.Mesh(geometry, material);
        SizeGroup.add(mesh);
        // 边界线
        let border = new THREE.BoxHelper(mesh, 0x0ed5c7);
        SizeGroup.add(border);
        // 标注尺寸
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
        // 标注值
        this.sizeFun(Math.round(newV3.x), SizeLineX.position, "size1");
        this.sizeFun(Math.round(newV3.y), SizeLineY.position, "size2");
        this.sizeFun(Math.round(newV3.z), SizeLineZ.position, "size3");
        scene.add(obj);
        this.setState({ treeData, MeshArr, SizeGroup });
        this.renderWebGL();
        this.renderWebGL();
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
    let height = window.innerHeight - 100;
    let k = width / height;
    let s = 100;
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 20000);
    this.camera.position.set(226, 118, 319);
    let length = this.camera.position.length();
    this.setState({ length });
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
    document
      .getElementById("three-board")
      .addEventListener("click", this.choose.bind(this));

    // renderpass
    let renderPass = new THREE.RenderPass(scene, this.camera);
    let OutlinePass = new THREE.OutlinePass(
      new THREE.Vector2(width, height),
      scene,
      this.camera
    );
    this.setState({ OutlinePass });
    OutlinePass.visibleEdgeColor = new THREE.Color(0, 1, 0);
    OutlinePass.hiddenEdgeColor = new THREE.Color(0, 1, 0);
    OutlinePass.edgeThickness = 3.0;
    this.composer = new THREE.EffectComposer(renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(OutlinePass);
    let FXAAShaderPass = new THREE.ShaderPass(THREE.FXAAShader);
    FXAAShaderPass.uniforms["resolution"].value.set(1 / width, 1 / height);
    FXAAShaderPass.renderToScreen = true;
    this.composer.addPass(FXAAShaderPass);
    this.labelRenderer = new THREE.CSS2DRenderer();
    this.labelRenderer.setSize(width, height);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0";
    this.labelRenderer.domElement.style.pointerEvents = "none";
    document
      .getElementById("three-board")
      .appendChild(this.labelRenderer.domElement);

    window.onresize = () => {
      let width = window.innerWidth - 200;
      let height = window.innerHeight - 100;
      let bool = false;
      OutlinePass.selectedObjects = [];
      renderer.setSize(window.innerWidth - 200, window.innerHeight - 100);
      k = (window.innerWidth - 200) / (window.innerHeight - 60);
      this.camera.left = -s * k;
      this.camera.right = s * k;
      this.camera.top = s;
      this.camera.bottom = -s;
      this.camera.updateProjectionMatrix();
      this.renderWebGL.call(this);
      this.setState({
        width,
        height,
        bool,
      });
      // location.reload();
    };

    // controls
    let controls = new window.THREE.OrbitControls(
      this.camera,
      renderer.domElement
    ); //创建控件对象
    controls.addEventListener("change", () => {
      let { bool, currentModel, left, top } = this.state;
      if (bool) {
        let worldPosition = new THREE.Vector3();
        currentModel.getWorldPosition(worldPosition);
        let standardVector = worldPosition.project(this.camera);
        let a = (window.innerWidth - 200) / 2;
        let b = (window.innerHeight - 100) / 2;
        left = Math.round(standardVector.x * a + a) + 200;
        top = Math.round(-standardVector.y * b + b) - 150 + 100;
        this.setState({
          left,
          top,
        });
      }
      this.renderWebGL();
    });
    // controls.enablePan = false;
    // controls.minZoom = 0.1;
    // controls.maxZoom = 10;

    console.log(window.THREE, scene, controls);
  }

  renderWebGL() {
    let { scene } = this.state;
    // renderer.render(scene, this.camera);
    // requestAnimationFrame(render.bind(this));
    this.composer.render();
    this.labelRenderer.render(scene, this.camera);
  }

  choose(event) {
    let {
      MeshArr,
      OutlinePass,
      scene,
      currentModel,
      ModelName,
      left,
      top,
      bool,
      cxtmenu,
    } = this.state;
    let Sx = event.clientX - 200;
    let Sy = event.clientY - 100;
    let x = (Sx / (window.innerWidth - 200)) * 2 - 1;
    let y = -(Sy / (window.innerHeight - 100)) * 2 + 1;
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    let Arr = [];
    MeshArr.forEach(function (Mesh) {
      if (Mesh.material.visible === true) {
        Arr.push(Mesh);
      }
    });
    let intersects = raycaster.intersectObjects(Arr);
    if (intersects.length > 0) {
      console.log("currentModel", currentModel);
      if (currentModel) {
        currentModel.traverse(function (object) {
          if (object.type === "Mesh") {
            object.material.color.copy(object.material.selfColor);
          }
        });
      }
      currentModel = intersects[0].object;
      currentModel.material.color.set(0x409eff);
      ModelName = currentModel.parent.name;
      scene.updateMatrixWorld(true);
      let worldPosition = new THREE.Vector3();
      currentModel.getWorldPosition(worldPosition);
      let standardVector = worldPosition.project(this.camera);
      let a = (window.innerWidth - 200) / 2;
      let b = (window.innerHeight - 100) / 2;
      left = Math.round(standardVector.x * a + a) + 200;
      top = Math.round(-standardVector.y * b + b) - 150 + 100;
      bool = true;
    } else {
      bool = false;
      if (currentModel) {
        currentModel.traverse(function (object) {
          if (object.type === "Mesh") {
            object.material.color.copy(object.material.selfColor);
          }
        });
      }
      OutlinePass.selectedObjects = [];
    }
    cxtmenu.bool = false;
    this.setState({
      currentModel,
      left,
      top,
      ModelName,
      cxtmenu,
      bool,
    }, ()=> {
      this.renderWebGL();
    });
  }
  onChange(value) {
    console.log(`selected ${value}`);
  }
  MaxClick() {
    console.log(`MaxClick`);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
    this.setState({
      bool: false,
    });
    this.renderWebGL();
  }
  SizeClick() {
    let { SizeBool, scene, SizeGroup } = this.state;
    if (SizeBool) {
      scene.add(SizeGroup);
      this.setState({
        SizeBool: false,
      });
      let arr = document.getElementsByClassName("label");
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.visibility = "visible";
      }
    } else {
      let arr = document.getElementsByClassName("label");
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.visibility = "hidden";
      }
      scene.remove(SizeGroup);
      this.setState({
        SizeBool: true,
      });
    }
    this.setState({
      bool: false,
    });
    this.renderWebGL();
  }
  SmallerClick() {
    let { scene } = this.state;
    scene.scale.x -= 0.1;
    scene.scale.y -= 0.1;
    scene.scale.z -= 0.1;
    this.setState({
      bool: false,
    });
    this.renderWebGL();
  }
  GreaterClick() {
    let { scene } = this.state;
    scene.scale.x += 0.1;
    scene.scale.y += 0.1;
    scene.scale.z += 0.1;
    this.setState({
      bool: false,
    });
    this.renderWebGL();
  }
  zhengClick() {
    let { scene, length } = this.state;
    this.camera.position.set(0, 0, length);
    this.camera.lookAt(scene.position);
    this.setState({
      bool: false,
    });
    this.renderWebGL();
  }
  fuClick() {
    let { scene, length } = this.state;
    this.camera.position.set(0, length, 0);
    this.camera.lookAt(scene.position);
    this.setState({
      bool: false,
    });
    this.renderWebGL();
  }
  ceClick() {
    let { scene, length } = this.state;
    this.camera.position.set(-length, 0, 0);
    this.camera.lookAt(scene.position);
    this.setState({
      bool: false,
    });
    this.renderWebGL();
  }
  zhouClick() {
    let { scene, length } = this.state;
    let vec3 = new THREE.Vector3(1, 1, 1).normalize();
    this.camera.position.set(vec3.x * length, vec3.y * length, vec3.z * length);
    this.camera.lookAt(scene.position);
    this.setState({
      bool: false,
    });
    this.renderWebGL();
  }
  hideClick() {
    let { MeshArr } = this.state;
    MeshArr.forEach(function (mesh) {
      mesh.material.visible = false;
    });
    this.setState({
      bool: false,
    });
    this.renderWebGL();
  }
  viewClick() {
    let { MeshArr } = this.state;
    MeshArr.forEach(function (mesh) {
      mesh.material.visible = true;
    });
    this.renderWebGL();
  }
  nodeClick(selectedKeys, info) {
    let { currentModel } = this.state;
    let data = info.node;
    console.log(data);
    let mesh = data.mesh;
    if (currentModel) {
      currentModel.traverse(function (object) {
        if (object.type === "Mesh") {
          object.material.color.copy(object.material.selfColor);
        }
      });
    }
    currentModel = mesh;
    currentModel.traverse(function (object) {
      if (object.type === "Mesh") {
        object.material.color.set(0x409eff);
      }
    });
    this.setState({
      selectedKeys,
      currentModel,
      bool: false,
    });
    this.renderWebGL();
  }
  helpClick() {
    Modal.info({
      title: "操作说明",
      content: (
        <div>
          <p>
            1.旋转：按住左键不放上下左右拖动，可以旋转整个场景
            <br />
            <br />
            2.缩放：滚动鼠标中键可以缩放模型
            <br />
            <br />
            3.选中：单击可以选中机械装配体中的一个零件，被选中的零件高亮显示，并弹出名称标签
            <br />
            <br />
            4.交互：通过UI按钮可以和对三维模型进行交互操作，预览模型相关信息
            <br />
            <br />
            5.右键隐藏显示：在某一个零件上右键可以通过弹窗UI隐藏或显示相关模型
            <br />
            <br />
            6.目录树：左侧目录树可以显示每一个零件，通过目录树可以控制模型
          </p>
        </div>
      ),
    });
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
    let { options, SizeBool, treeData, progressValue, progressBool, ModelName, bool, left, top, selectedKeys } =
      this.state;
    return (
      <>
        <div className={`progress-con ${progressBool ? "" : "hide"}`}>
          <Progress percent={progressValue} status="active" />
        </div>
        <div id="three-board"></div>
        <div id="top">
          <div className="c-logo">
            <img src={imgList.i0} alt="" width="40" />
          </div>
          <div className="c-select">
            <Select
              placeholder=""
              defaultValue="千斤顶"
              onChange={this.onChange.bind(this)}
            >
              {options.map((item, index) => {
                return (
                  <Option value={item.value} key={index}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div id="menu">
            <i
              className="max"
              datatype="最大化"
              onClick={this.MaxClick.bind(this)}
            ></i>
            <i
              className={`size ${SizeBool ? "SizeBool" : ""}`}
              datatype="尺寸"
              onClick={this.SizeClick.bind(this)}
            ></i>
            <i
              className="smaller"
              datatype="缩小"
              onClick={this.SmallerClick.bind(this)}
            ></i>
            <i
              className="greater"
              datatype="放大"
              onClick={this.GreaterClick.bind(this)}
            ></i>
            <i
              className="zheng"
              datatype="正视图"
              onClick={this.zhengClick.bind(this)}
            ></i>
            <i
              className="fu"
              datatype="俯视图"
              onClick={this.fuClick.bind(this)}
            ></i>
            <i
              className="ce"
              datatype="侧视图"
              onClick={this.ceClick.bind(this)}
            ></i>
            <i
              className="zhou"
              datatype="轴测图"
              onClick={this.zhouClick.bind(this)}
            ></i>
            <i
              className="view"
              datatype="显示"
              onClick={this.viewClick.bind(this)}
            ></i>
            <i
              className="hide"
              datatype="隐藏"
              onClick={this.hideClick.bind(this)}
            ></i>
          </div>
          <div className="c-danger">
            <i
              className="help"
              datatype="帮助"
              onClick={this.helpClick.bind(this)}
            ></i>
          </div>
        </div>
        <div id="left">
          <div>
            {
              treeData.length > 0 ? <Tree
                defaultExpandAll={true}
                autoExpandParent={true}
                onSelect={this.nodeClick.bind(this)}
                treeData={treeData}
                selectedKeys={bool ? [] : selectedKeys}
              ></Tree> : null
            }
          </div>
        </div>
        <div id="size1"></div>
        <div id="size2"></div>
        <div id="size3"></div>
        {
          bool ? <>
            <div id="name" style={{left: left + 180 + 'px', top: top - 24 + 'px'}}>
                <span>{ ModelName }</span>
            </div>
            <div className="name-line" style={{left: left + 'px', top: top + 'px'}}>
                <img src={imgList.i1} alt="" width="250"/>
            </div>
          </> : null
        }
      </>
    );
  }
}

export default Game;
