/* eslint-disable no-debugger */
/* eslint-disable no-var */
/* eslint-disable no-undef */
import React from "react";
import "./index.scss";
import 播放 from "./img/播放.png";
import 暂停 from "./img/暂停.png";
const imgList = {
  播放: 播放,
  暂停: 暂停,
};
console.log(imgList);
import { Slider } from 'antd';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeScale: 3.5,
      progressValue: 0,
      progressBool: true,
      playBool: true,
      time: 0,
    };
  }

  componentDidMount() {
    /**
     * 创建场景对象Scene
     */
    let scene = new window.THREE.Scene();
    // 轴辅助
    let AxesHelper = new THREE.AxesHelper(100);
    scene.add(AxesHelper);

    this.action = null;
    let mixer = null;
    let loader = new THREE.ObjectLoader();
    // let timeArr = [];
    function json(Object3D) {
      console.log(Object3D, "Object3D");
      scene.add(Object3D);
      mixer = new THREE.AnimationMixer(Object3D);
      this.action = mixer.clipAction(Object3D.animations[0]);
      this.action.timeScale = this.state.timeScale;
      this.action.play();
      Object3D.animations[0].duration = 47.2;
    }
    function onProgress(xhr) {
      console.log("xhr", xhr);
      // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      // this.setState(
      //   {
      //     progressValue: Math.floor((xhr.loaded / xhr.total) * 100),
      //   },
      //   () => {
      //     if (this.state.progressValue === 100) {
      //       this.setState({ progressBool: false });
      //     }
      //   }
      // );
    }
    loader.load("./modal/pump.json", json.bind(this), onProgress.bind(this));
    /**
     * 光源设置
     */
    let point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300);
    scene.add(point);
    let ambient = new THREE.AmbientLight(0x888888);
    scene.add(ambient);
    /**
     * 相机设置
     */
    let width = window.innerWidth;
    let height = window.innerHeight;
    let k = width / height;
    let s = 4;
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    this.camera.position.set(-5.0, 3.43, 11.31);
    this.camera.lookAt(new THREE.Vector3(-1.22, 2.18, 4.58));
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: true,
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
      if (timeS > freshTime) {
        renderer.render(scene, this.camera);
        timeS = 0;
      }
      if (this.action) {
        this.setState({
          time: this.action.time,
        })
      }
      if (mixer) {
        mixer.update(deltaTime);
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
  play() {
    if (this.state.playBool) {
      this.action.paused = true
      this.setState({
        playBool: false,
      });
    } else {
      this.action.paused = false
      this.setState({
        playBool: true,
      });
    }
  }
  paused() {
    clip.paused = true
  }
  onChangeProgress(value) {
    this.setState({
      time: value,
    })
    this.action.time = value
  }
  onChangeSpeed(value) {
    this.setState({
      timeScale: value,
    })
    this.action.timeScale = value
  }

  render() {
    let {playBool, time, timeScale} = this.state;
    return <div>
      <div id="three-board"></div>
      <div className="operate">
        <div style={{position: "absolute", left: "0px", top: "19px"}}>
          <img src={playBool ? imgList.暂停 : imgList.播放} alt="" height="50" width="50" onClick={this.play.bind(this)}/>
        </div>
        <div className="progress">
          装配进度
        </div>
        <div className="progress-con">
          <Slider value={time} min={0} max={47.2} step={0.01} style={{width: "300px"}} onChange={this.onChangeProgress.bind(this)}/>
        </div>
        <div className="speed">
          播放速度
        </div>
        <div className="speed-con">
          <Slider value={timeScale} min={0} max={10} step={0.01} style={{width: "300px"}} onChange={this.onChangeSpeed.bind(this)}/>
        </div>
      </div>
    </div>;
  }
}

export default Game;
