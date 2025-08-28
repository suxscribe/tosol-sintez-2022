import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CameraControls from 'camera-controls';
import EventEmitter from './../utils/EventEmitter';
import { debugObject } from './data/vars';

export default class Camera extends EventEmitter {
  constructor(_options) {
    super();

    this.fov = _options.fov;
    this.sizes = _options.sizes;
    this.debug = _options.debug;
    this.renderer = _options.renderer;
    this.time = _options.time;

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.azimuthRotateSpeed = 0.5;
    this.dollySpeed = 0.5;
    this.polarRotateSpeed = 0.5;
    this.truckSpeed = 0.7;

    this.setInstance();
    this.setCameraControls();
    this.setCameraControlsEvents();
  }

  setInstance() {
    // Set Camera instance
    this.instance = new THREE.PerspectiveCamera(this.fov, this.sizes, 0.1, 250);

    this.instance.position.set(19, 7, -5);

    // Debug
    if (this.debug && debugObject.showDebug === true) {
      this.debug
        .add(this.instance.position, 'x')
        .min(-50)
        .max(50)
        .step(0.1)
        .name('Camera X')
        .listen();
      this.debug
        .add(this.instance.position, 'y')
        .min(-40)
        .max(40)
        .step(0.1)
        .name('Camera y')
        .listen();
      this.debug
        .add(this.instance.position, 'z')
        .min(-40)
        .max(40)
        .step(0.1)
        .name('Camera z')
        .listen();
    }
  }

  setCameraControls() {
    CameraControls.install({ THREE: THREE });

    this.clock = new THREE.Clock();
    this.cameraControls = new CameraControls(
      this.instance,
      this.renderer.domElement
    );

    this.cameraControls.dampingFactor = 0.01;
    this.cameraControls.draggingDampingFactor = 0.01;
    this.cameraControls.azimuthRotateSpeed = this.azimuthRotateSpeed;
    this.cameraControls.polarRotateSpeed = this.polarRotateSpeed;
    this.cameraControls.dollySpeed = this.dollySpeed;
    this.cameraControls.truckSpeed = this.truckSpeed; // pan speed

    this.cameraControls.minDistance = 15;
    this.cameraControls.maxDistance = 20;
    this.cameraControls.minAzimuthAngle = Math.PI * 0.6; // clockwise
    this.cameraControls.maxAzimuthAngle = Math.PI * 0.8; // counter clockwise
    this.cameraControls.minPolarAngle = Math.PI * 0.43;
    this.cameraControls.maxPolarAngle = Math.PI * 0.49; // lower

    this.boundary = new THREE.Box3(
      new THREE.Vector3(-1, 1, -3),
      new THREE.Vector3(5, 3, 3)
    );

    this.boundaryHelper = new THREE.Box3Helper(this.boundary, 0xffff00);

    this.cameraControls.setBoundary(this.boundary);
    // this.cameraControls.boundaryEnclosesCamera = true;
    this.cameraControls.setTarget(1, 1.5, 0);
  }

  setCameraControlsEvents() {
    if (this.cameraControls) {
      // Listen to camera updates for render on demand etc
      this.cameraControls.addEventListener('transitionstart', () => {
        // console.log('cameratransitionstart');
        this.trigger('cameratransitionstart');
      });
      this.cameraControls.addEventListener('rest', () => {
        // console.log('cameratransitionend');
        this.trigger('cameratransitionend');
        // this.setDefaultControlsSpeed();
      });
      this.cameraControls.addEventListener('update', () => {
        // console.log('camera update');
        this.trigger('cameraupdate');
      });

      this.renderer.domElement.addEventListener('touchstart', () => {
        this.setDefaultControlsSpeed();
      });
      this.renderer.domElement.addEventListener('mousedown', () => {
        this.setDefaultControlsSpeed();
      });
    }

    this.time.on('tick', () => {
      this.cameraControls.update(1 / this.time.delta);
    });
  }

  setDefaultControlsSpeed() {
    // this.cameraControls.azimuthRotateSpeed = this.azimuthRotateSpeed;
    // this.cameraControls.polarRotateSpeed = this.polarRotateSpeed;
    // this.cameraControls.dollySpeed = this.dollySpeed;
    // this.cameraControls.truckSpeed = this.truckSpeed;

    // reset damping values after Camera Initial fly. Looks ugly, but works
    this.cameraControls.dampingFactor = 0.01;
    this.cameraControls.draggingDampingFactor = 0.01;
  }

  startCameraInitialFly() {
    // set fly values
    // this.cameraControls.azimuthRotateSpeed = 0.01;
    // this.cameraControls.polarRotateSpeed = 0.01;
    // this.cameraControls.dollySpeed = 0.01;

    this.cameraControls.dampingFactor = 0.003;
    this.cameraControls.draggingDampingFactor = 0.003;

    this.cameraControls.setPosition(10, 4, -12, true);
  }
}
