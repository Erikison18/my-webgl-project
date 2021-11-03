/* eslint-disable no-debugger */
/* eslint-disable no-var */
/* eslint-disable no-undef */
import React from "react";
import { TrackballControls } from '../../common/threejs/TrackballControls.js';
import { PDBLoader } from "../../common/threejs/PDBLoader.js";
import {
  CSS3DRenderer,
  CSS3DObject,
  CSS3DSprite,
} from "../../common/threejs/CSS3DRenderer";
import ballImg from "../../common/threejs/ball.png";
import pdb1 from "../../common/threejs/caffeine.pdb";
import "./index.scss";

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
    let AxesHelper = new THREE.AxesHelper(100);
    scene.add(AxesHelper);
    //模型
    var offset = new THREE.Vector3();
    var tmpVec1 = new THREE.Vector3();
    var tmpVec2 = new THREE.Vector3();
    var tmpVec3 = new THREE.Vector3();
    var tmpVec4 = new THREE.Vector3();

    var visualizationType = 2;

    let root = new THREE.Object3D();
    scene.add(root);

    let objects = [];
    let colorSpriteMap = {};
    let loader = new PDBLoader();
    let baseSprite = document.createElement("img");
    baseSprite.src = ballImg;
    baseSprite.onload = function () {
      loadMolecule(pdb1);
      // createMenu();
    };
    //
    var b_a = document.getElementById("b_a");
    var b_b = document.getElementById("b_b");
    var b_ab = document.getElementById("b_ab");
    b_a.addEventListener("click", function () {
      visualizationType = 0;
      showAtoms();
    });
    b_b.addEventListener("click", function () {
      visualizationType = 1;
      showBonds();
    });
    b_ab.addEventListener("click", function () {
      visualizationType = 2;
      showAtomsBonds();
    });
    //加载模型
    function loadMolecule(url) {
      for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        object.parent.remove(object);
      }

      objects = [];

      loader.load(url, function (pdb) {
        // console.log(pdb, "pdb");
        var geometryAtoms = pdb.geometryAtoms;
        var geometryBonds = pdb.geometryBonds;
        var json = pdb.json;

        geometryAtoms.computeBoundingBox();
        geometryAtoms.boundingBox.getCenter(offset).negate();

        geometryAtoms.translate(offset.x, offset.y, offset.z);
        geometryBonds.translate(offset.x, offset.y, offset.z);

        var positions = geometryAtoms.getAttribute("position");
        var colors = geometryAtoms.getAttribute("color");

        var position = new THREE.Vector3();
        var color = new THREE.Color();

        for (var i = 0; i < positions.count; i++) {
          position.x = positions.getX(i);
          position.y = positions.getY(i);
          position.z = positions.getZ(i);

          color.r = colors.getX(i);
          color.g = colors.getY(i);
          color.b = colors.getZ(i);

          var innerText = "";
          switch (color.g) {
            case 0.5647059082984924:
              innerText = "C";
              break;
            case 0.05098039284348488:
              innerText = "O"
              break;
            case 0.3137255012989044:
              innerText = "N"
              break;
            case 1:
              innerText = "H"
              break;
            default:
              break;
          }
          // console.log(innerText, position);
          var label = document.createElement("div");
          label.className = "label";
          label.style.color = color.getStyle();
          label.innerHTML = innerText;
          let objectLabel = new CSS3DObject(label);
          objectLabel.position.copy(position);
          objectLabel.position.multiplyScalar(75);
          objectLabel.position.x = objectLabel.position.x + 50;
          objectLabel.matrixAutoUpdate = false;
          objectLabel.updateMatrix();
          root.add(objectLabel);
          objects.push(objectLabel);

          let atom = json.atoms[i];
          var element = atom[4];

          if (!colorSpriteMap[element]) {
            var canvas = imageToCanvas(baseSprite);
            var context = canvas.getContext("2d");

            colorify(context, canvas.width, canvas.height, color);

            var dataUrl = canvas.toDataURL();

            colorSpriteMap[element] = dataUrl;
          }

          var colorSprite = colorSpriteMap[element];

          atom = document.createElement("img");
          atom.src = colorSprite;

          var object = new CSS3DSprite(atom);
          object.position.copy(position);
          object.position.multiplyScalar(75);

          object.matrixAutoUpdate = false;
          object.updateMatrix();

          root.add(object);

          objects.push(object);
        }

        positions = geometryBonds.getAttribute("position");

        var start = new THREE.Vector3();
        var end = new THREE.Vector3();

        for (let i = 0; i < positions.count; i += 2) {
          start.x = positions.getX(i);
          start.y = positions.getY(i);
          start.z = positions.getZ(i);

          end.x = positions.getX(i + 1);
          end.y = positions.getY(i + 1);
          end.z = positions.getZ(i + 1);

          start.multiplyScalar(75);
          end.multiplyScalar(75);

          tmpVec1.subVectors(end, start);
          var bondLength = tmpVec1.length() - 50;

          //

          var bond = document.createElement("div");
          bond.className = "bond";
          bond.style.height = bondLength + "px";

          object = new CSS3DObject(bond);
          object.position.copy(start);
          object.position.lerp(end, 0.5);

          object.userData.bondLengthShort = bondLength + "px";
          object.userData.bondLengthFull = bondLength + 55 + "px";

          //

          var axis = tmpVec2.set(0, 1, 0).cross(tmpVec1);
          var radians = Math.acos(
            tmpVec3.set(0, 1, 0).dot(tmpVec4.copy(tmpVec1).normalize())
          );

          var objMatrix = new THREE.Matrix4().makeRotationAxis(
            axis.normalize(),
            radians
          );
          object.matrix = objMatrix;
          object.quaternion.setFromRotationMatrix(object.matrix);

          object.matrixAutoUpdate = false;
          object.updateMatrix();

          root.add(object);

          objects.push(object);

          //

          bond = document.createElement("div");
          bond.className = "bond";
          bond.style.height = bondLength + "px";

          var joint = new THREE.Object3D(bond);
          joint.position.copy(start);
          joint.position.lerp(end, 0.5);

          joint.matrix.copy(objMatrix);
          joint.quaternion.setFromRotationMatrix(joint.matrix);

          joint.matrixAutoUpdate = false;
          joint.updateMatrix();

          object = new CSS3DObject(bond);
          object.rotation.y = Math.PI / 2;

          object.matrixAutoUpdate = false;
          object.updateMatrix();

          object.userData.bondLengthShort = bondLength + "px";
          object.userData.bondLengthFull = bondLength + 55 + "px";

          object.userData.joint = joint;

          joint.add(object);
          root.add(joint);

          objects.push(object);
        }

        // console.log("CSS3DObjects:", objects);

        switch (visualizationType) {
          case 0:
            showAtoms();
            break;
          case 1:
            showBonds();
            break;
          case 2:
            showAtomsBonds();
            break;
        }
      });
    }
    function showAtoms() {
      for (var i = 0; i < objects.length; i++) {
        var object = objects[i];

        if (object instanceof CSS3DSprite) {
          object.element.style.display = "";
          object.visible = true;
        } else {
          object.element.style.display = "none";
          object.visible = false;
        }
      }
    }
    function showBonds() {
      for (var i = 0; i < objects.length; i++) {
        var object = objects[i];

        if (object instanceof CSS3DSprite) {
          object.element.style.display = "none";
          object.visible = false;
        } else {
          object.element.style.display = "";
          object.element.style.height = object.userData.bondLengthFull;
          object.visible = true;
        }
      }
    }
    function showAtomsBonds() {
      for (var i = 0; i < objects.length; i++) {
        var object = objects[i];

        object.element.style.display = "";
        object.visible = true;

        if (!(object instanceof CSS3DSprite)) {
          object.element.style.height = object.userData.bondLengthShort;
        }
      }
    }
    function colorify(ctx, width, height, color) {
      var r = color.r,
        g = color.g,
        b = color.b;

      var imageData = ctx.getImageData(0, 0, width, height);
      var data = imageData.data;

      for (var i = 0, l = data.length; i < l; i += 4) {
        data[i + 0] *= r;
        data[i + 1] *= g;
        data[i + 2] *= b;
      }

      ctx.putImageData(imageData, 0, 0);
    }
    function imageToCanvas(image) {
      var width = image.width;
      var height = image.height;

      var canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);

      return canvas;
    }
    /**
     * 光源设置
     */
    /**
     * 相机设置
     */
    let width = window.innerWidth; //窗口宽度
    let height = window.innerHeight; //窗口高度
    this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 5000);
    this.camera.position.z = 800;
    // this.camera.position.set(0,0,10);
    // this.camera.lookAt(scene.position);
    /**
     * 创建渲染器对象
     */
    let renderer = new CSS3DRenderer();
    renderer.setSize(width, height); //设置渲染区域尺寸
    document.getElementById("three-board").appendChild(renderer.domElement); //body元素中插入canvas对象

    let controls = new TrackballControls(this.camera, renderer.domElement);
		controls.rotateSpeed = 0.5;

    function render() {
      renderer.render(scene, this.camera);
      controls.update();
      let time = Date.now() * 0.0004;
      root.rotation.x = time;
      root.rotation.y = time * 0.7;

      requestAnimationFrame(render.bind(this));
    }
    render.call(this);

    console.log(window.THREE, scene);
  }

  render() {
    return (
      <div>
        <div id="three-board"></div>
        <div id="topmenu">
          <button id="b_a">Atoms</button>
          <button id="b_b">Bonds</button>
          <button id="b_ab">Atoms + Bonds</button>
        </div>
      </div>
    );
  }
}

export default Game;
