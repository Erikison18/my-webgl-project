/* eslint-disable no-debugger */
/* eslint-disable no-var */
/* eslint-disable no-undef */
import React from "react";
import { Spin } from 'antd';
import "./index.scss";
import music from "./music/琵琶语.mp3";
import styleObjArr from "./path";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioBoool: true,
      ScreenBoool: true,
      rotateBoool: true,
      styleArr: styleObjArr,
      styleChoose: null,
      posArr: [],
      posChoose: null,
      num: 1,
      total: styleObjArr[0].children[0].jpgNameArr.length,
      spinning: false,
    };
  }

  componentDidMount() {
    /**
     * 创建场景对象Scene
     */
    let scene = new window.THREE.Scene();
    // 轴辅助
    // let AxesHelper = new THREE.AxesHelper(1000);
    // scene.add(AxesHelper);
    // 添加模型
    let box = new THREE.SphereGeometry(25, 50, 50);
    let material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
    });
    this.mesh = new THREE.Mesh(box, material);
    scene.add(this.mesh);

    let listener = new THREE.AudioListener();
    this.audio = new THREE.Audio(listener);
    let audioLoader = new THREE.AudioLoader();
    audioLoader.load(music, (AudioBuffer) => {
      this.audio.setBuffer(AudioBuffer);
      this.audio.setLoop(true);
      this.audio.setVolume(0.3);
      this.audio.play();
    });

    /**
     * 光源设置
     */
    let ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);
    /**
     * 相机设置
     */
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(-0.87, 0.03, 0.4);
    this.camera.lookAt(scene.position);
    /**
     * 创建渲染器对象
     */
    let renderer = new window.THREE.WebGLRenderer({
      antialias: 0,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象

    let clock = new THREE.Clock();
    let FPS = 30;
    let refreshTime = 1 / FPS;
    let timeS = 0;
    function render() {
      let { rotateBoool } = this.state;
      requestAnimationFrame(render.bind(this));
      let deltaTime = clock.getDelta();
      timeS = timeS + deltaTime;
      if (timeS > refreshTime) {
        renderer.render(scene, this.camera);
        if (rotateBoool) {
          this.mesh.rotateY(0.002);
        }
        timeS = 0;
      }
    }
    render.call(this);

    let controls = new window.THREE.OrbitControls(
      this.camera,
      renderer.domElement
    ); //创建控件对象

    console.log(window.THREE, scene, controls);

    let firstStyle = this.state.styleArr[0];
    this.setState({
      posArr: firstStyle.children,
      styleChoose: firstStyle,
      posChoose: firstStyle.children[0],
    })
    this.setMeshMap(firstStyle, firstStyle.children[0], 0);
  }

  audioClick() {
    let { audioBoool } = this.state;
    if (audioBoool) {
      this.setState({ audioBoool: false });
      this.audio.stop();
    } else {
      this.setState({ audioBoool: true });
      this.audio.play();
    }
  }
  ScreenClick() {
    let { ScreenBoool } = this.state;
    if (ScreenBoool) {
      this.setState({ ScreenBoool: false });
      this.requestFullScreen();
    } else {
      this.setState({ ScreenBoool: true });
      this.exitFullscreen();
    }
  }
  rotateClick() {
    this.setState({
      rotateBoool: !this.state.rotateBoool,
    });
  }
  styleClick(item) {
    this.setState({
      styleChoose: item,
      posArr: item.children,
      posChoose: item.children[0],
      num: 1,
      total: item.children[0].jpgNameArr.length,
    })
    this.setMeshMap(item, item.children[0], 0);
  }
  posClick(item) {
    let {styleChoose} = this.state;
    this.setState({
      posChoose: item,
      num: 1,
      total: item.jpgNameArr.length,
    })
    this.setMeshMap(styleChoose, item, 0);
  }
  nextClick() {
    let {styleChoose, posChoose, num} = this.state;
    num++;
    if (num > posChoose.jpgNameArr.length) {
      num = 1
    }
    this.setMeshMap(styleChoose, posChoose, num - 1);

    this.setState({
      num: num,
    })
  }
  prevClick() {
    let {styleChoose, posChoose, num} = this.state;
    num--;
    if (num <= 0) {
      num = posChoose.jpgNameArr.length
    }
    this.setMeshMap(styleChoose, posChoose, num - 1);

    this.setState({
      num: num,
    })
  }
  setMeshMap(styleChoose, posChoose, num) {
    let textureLoader = new THREE.TextureLoader();
    this.setState({spinning: true});
    console.log()
    let texture = textureLoader.load(`/style/${styleChoose.key}/${posChoose.key}/${posChoose.jpgNameArr[num]}`, ()=> {
      this.setState({spinning: false});
    }
    );
    this.mesh.material.map = texture;
  }
  requestFullScreen() {
    var de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
  }
  exitFullscreen() {
    var de = document;
    if (de.exitFullscreen) {
      de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    }
  }

  render() {
    let { audioBoool, ScreenBoool, rotateBoool, styleArr, posArr, styleChoose, posChoose, num, total, spinning } = this.state;
    return (
      <div>
        <Spin spinning={spinning}>
        <div id="three-board"></div>
        <div className="controls">
          <button
            className={audioBoool ? "open" : "close"}
            onClick={this.audioClick.bind(this)}
          ></button>
          <button
            className={ScreenBoool ? "full" : "noFull"}
            onClick={this.ScreenClick.bind(this)}
          ></button>
          <button
            className={rotateBoool ? "rotate" : "noRotate"}
            onClick={this.rotateClick.bind(this)}
          ></button>
        </div>
        <div id="menu">
          <div className="style">
            <span className="classify">风格:</span>
            {
              styleChoose && styleArr.map((item, index)=> {
                return <span key={index} className={item.name === styleChoose.name ? "active" : ""} onClick={this.styleClick.bind(this, item)}>{item.name}</span>
              })
            }
          </div>
          <div className="pos">
            <span className="classify">位置:</span>
            {
              posChoose && posArr.map((item, index)=> {
                return item.jpgNameArr.length > 0 && <span key={index} className={item.name === posChoose.name ? "active" : ""} onClick={this.posClick.bind(this, item)}>{item.name}</span>
              })
            }
          </div>
        </div>
        <div className="page">
          <div>{num}/{total}</div>
        </div>
        <div className={"next swiper"} onClick={this.nextClick.bind(this)}>{">"}</div>
        <div className={"prev swiper"} onClick={this.prevClick.bind(this)}>{"<"}</div>
        </Spin>
      </div>
    );
  }
}

export default Game;
