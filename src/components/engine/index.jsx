/* eslint-disable no-debugger */
/* eslint-disable no-var */
/* eslint-disable no-undef */
import React from "react";
import { Progress, notification } from 'antd';
import fileArr from "./data";
import "./index.scss";
import nx from "./img/nx.jpg";
import ny from "./img/ny.jpg";
import nz from "./img/nz.jpg";
import px from "./img/px.jpg";
import py from "./img/py.jpg";
import pz from "./img/pz.jpg";
const imgList = {
  nx, ny, nz, px, py, pz
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progressValue: 0,
      progressBool: true,
      num: 0,
      modelArr: [],
      currentModel: null,
      currentModelData: null,
      left: 0,
      top: 0,
      bool: false,
    };
  }

  componentDidMount() {
    /**
     * 创建场景对象Scene
     */
    this.scene = new window.THREE.Scene();
    // 轴辅助
    // let AxesHelper = new THREE.AxesHelper(1000);
    // this.scene.add(AxesHelper);

    this.ViewGroup = new THREE.Group();
    this.scene.add(this.ViewGroup)

    let loader = new THREE.FBXLoader();
    let textureCube = new THREE.CubeTextureLoader()
      // .setPath('./贴图/环境贴图/环境贴图4/')
      .load.call([imgList.px, imgList.py, imgList.pz, imgList.nx, imgList.ny, imgList.nz], function(texture) {
        // render();
        console.log(texture)
    });

    function onProgress(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      let progressValue = Math.floor(xhr.loaded / xhr.total * 100)
      this.setState({
        progressBool: true,
        progressValue
      })
    }
    function loadFile(filePath, informationObj) {
      return new Promise((resolve, reject)=> {
        loader.load(filePath, (data)=> {
            this.setState({progressBool: false, progressValue: 0})
            notification.success({
              message: "",
              description: informationObj.fileName + '模型加载完成!',
              duration: 1.5,
            });
            load.call(this, data, informationObj)
            resolve(data);
          },
          onProgress.bind(this),
          function(error) {
            reject(error);
          });
      });
    }

    async function fetchModal() {
      for (let i = 0; i < fileArr.length; i++) {
        await loadFile.call(this, "./engineFbx/" + fileArr[i].key + ".fbx", fileArr[i]);
      }
    }
    fetchModal.call(this);

    function load(Obj, informationObj) {
      var obj = Obj.children[0]
      obj.data = informationObj.data;
      let { modelArr } = this.state;
      modelArr.push(obj);
      this.setState({
        modelArr: modelArr
      })
      obj.rotateX(Math.PI / 2)
      obj.traverse(function(object) {
        if (object.type === 'Mesh') {
          var color;
          if (object.material.color === undefined) {
            color = new THREE.Color(1, 1, 1)
          } else {
            color = object.material.color
          }
          object.material = new THREE.MeshPhysicalMaterial({
            color: color,
            metalness: 1.0,
            roughness: 0.6,
            envMap: textureCube,
          })
        }
      })
      var box3 = new THREE.Box3()
      box3.expandByObject(obj)
      var v3 = new THREE.Vector3()
      box3.getSize(v3)
      function num() {
        var max;
        if (v3.x > v3.y) {
          max = v3.x
        } else {
          max = v3.y
        }
        if (max < v3.z) {
          max = v3.z
        }
        return max;
      }
      var S = 100 / num()
      obj.scale.set(S, S, S)
      var newBox3 = new THREE.Box3()
      newBox3.expandByObject(obj)
      var center = new THREE.Vector3()
      newBox3.getCenter(center)
      obj.position.x = obj.position.x - center.x
      obj.position.y = obj.position.y - center.y
      obj.position.z = obj.position.z - center.z
      if (obj.data.name === '离心叶轮') {
        this.goToNum(0);
      }
    }
    /**
     * 光源设置
     */
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(100, 350, 200);
    this.scene.add(directionalLight);
    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight2.position.set(-300, -100, -400);
    this.scene.add(directionalLight2);
    let directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight3.position.set(10, 300, 30);
    this.scene.add(directionalLight3);
    let point = new THREE.PointLight(0xffffff, 0.9);
    point.position.set(400, 150, 300);
    this.scene.add(point);
    let ambient = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambient);
    /**
     * 相机设置
     */
    let width = window.innerWidth;
    let height = window.innerHeight;
    let k = width / height;
    let s = 80;
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);
    this.camera.position.set(162, 164, 341);
    this.camera.lookAt(this.scene.position);
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0x222222, 1);
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象

    function render() {
      renderer.render(this.scene, this.camera);
      requestAnimationFrame(render.bind(this));
    }
    render.call(this);
    let controls = new window.THREE.OrbitControls(
      this.camera,
      renderer.domElement
    ); //创建控件对象

    console.log(window.THREE, this.scene, controls);
  }

  nextClick() {
    let { num, modelArr } = this.state;
    num++;
    if (num >= modelArr.length) {
      num = 0;
    }
    this.goToNum(num);
  }
  prevClick() {
    let { num, modelArr } = this.state;
    num--;
    if (num < 0) {
      num = modelArr.length - 1;
    }
    this.goToNum(num);
  }
  goToNum(num) {
    let { modelArr } = this.state;
    this.ViewGroup.children[0] = modelArr[num];
    this.scene.updateMatrixWorld(true);

    let currentModel = modelArr[num]
    let currentModelData = currentModel.data;
    let worldPosition = new THREE.Vector3();
    modelArr[num].getWorldPosition(worldPosition)
    let standardVector = worldPosition.project(this.camera);
    let a = window.innerWidth / 2;
    let b = window.innerHeight / 2;
    let left = Math.round(standardVector.x * a + a);
    let top = Math.round(-standardVector.y * b + b) - 250;
    let bool = true;

    this.setState({
      num,
      currentModel,
      currentModelData,
      left,
      top,
      bool,
    })

    this.zhouClick();
  }

  zhengClick() {
    this.camera.position.set(0, 0, 341);
    this.camera.lookAt(this.scene.position);
  }
  fuClick() {
    this.camera.position.set(0, 164, 0);
    this.camera.lookAt(this.scene.position);
  }
  ceClick() {
    this.camera.position.set(162, 0, 0);
    this.camera.lookAt(this.scene.position);
  }
  zhouClick() {
    this.camera.position.set(162, 164, 341);
    this.camera.lookAt(this.scene.position);
  }

  render() {
    let { progressValue, progressBool, modelArr, num, currentModelData, left, top } = this.state;
    return (
      <div>
        <div id="three-board"></div>
        <div className={`progress-con ${progressBool ? "" : "hide"}`}>
          <Progress percent={progressValue} status="active" />
        </div>
        <div className={"next swiper"} onClick={this.nextClick.bind(this)}>{">"}</div>
        <div className={"prev swiper"} onClick={this.prevClick.bind(this)}>{"<"}</div>
        <div className="page">
          <div>{num + 1}/{modelArr.length}</div>
        </div>
        {
          currentModelData && <table border="1" id="table">
            <tbody>
              <tr>
                <th colSpan="2" rowSpan="2" style={{fontSize: "20px"}}>{currentModelData.name}</th>
                <th style={{width: "40px"}}>编号</th>
                <th style={{width: "100px"}}>{currentModelData.num}</th>
              </tr>
              <tr>
                <th>材质</th>
                <th>{currentModelData.material}</th>
              </tr>
              <tr>
                <td style={{width: "64px"}}>&nbsp;&nbsp;&nbsp;&nbsp;生产</td>
                <td style={{width: "100px"}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{currentModelData.production}</td>
                <th>重量</th>
                <th>{currentModelData.weight}g</th>
              </tr>
            </tbody>
          </table>
        }
        {
          currentModelData && <div id="introduction">
            {currentModelData.introduction}
          </div>
        }
        {
          currentModelData && <div id="name" style={{top: `${top}px`, left: `${left}px`}}>
            <span>{currentModelData.name}</span>
          </div>
        }
        <div id="menu">
          <div>
            <i className="zheng" onClick={this.zhengClick.bind(this)}></i>
          </div>
          <div>
            <i className="fu" onClick={this.fuClick.bind(this)}></i>
          </div>
          <div>
            <i className="ce" onClick={this.ceClick.bind(this)}></i>
          </div>
          <div>
            <i className="zhou" onClick={this.zhouClick.bind(this)}></i>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
