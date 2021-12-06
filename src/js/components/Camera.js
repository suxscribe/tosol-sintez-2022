import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CameraControls from 'camera-controls';
import EventEmitter from './../utils/EventEmitter';

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

    this.setInstance();
    // this.setOrbitControls(); // disable orbit controls.
    this.setCameraControls();
    this.setCameraControlsEvents();
  }

  setInstance() {
    // Set Camera instance
    this.instance = new THREE.PerspectiveCamera(
      this.fov,
      this.sizes,
      0.1,
      1000
    );

    this.instance.position.set(30, 19, 19);

    // Debug
    if (this.debug) {
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

  setOrbitControls() {
    // Note. This overrides Camera.lookAt
    this.controls = new OrbitControls(this.instance, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06; // lower smoother
    // this.controls.autoRotate = true;
    this.controls.rotateSpeed = 0.5; // 0.1
    this.controls.panSpeed = 0.5; // 0.1
    this.controls.zoomSpeed = 0.5; // 0.3

    this.controls.maxAzimuthAngle = Math.PI * 0.8;
    this.controls.minAzimuthAngle = Math.PI * 0.25;
    this.controls.maxPolarAngle = Math.PI * 0.55;
    this.controls.minPolarAngle = Math.PI * 0.33;
    this.controls.maxDistance = 40;
    this.controls.minDistance = 15;
    // this.controls.enablePan = false;

    // set initial camera target
    this.controls.target.set(3, 5, 1);

    // Panning limit
    var minPan = new THREE.Vector3(-10, -10, -10); // min panning
    var maxPan = new THREE.Vector3(10, 10, 10); //max panning
    var _v = new THREE.Vector3();

    this.controlsPanLimit = () => {
      _v.copy(this.controls.target);
      this.controls.target.clamp(minPan, maxPan);
      _v.sub(this.controls.target);
      this.instance.position.sub(_v);
    };

    this.controls.addEventListener('change', this.controlsPanLimit.bind(this));

    // Update controls
    this.time.on('tick', () => {
      this.controls.update(); // needed for controls transitions on mouse up
    });

    // Debug
    if (this.debug) {
      this.debug
        .add(this.controls.target, 'x')
        .min(-20)
        .max(20)
        .step(0.1)
        .name('Camera Target X')
        .listen();
      this.debug
        .add(this.controls.target, 'y')
        .min(-20)
        .max(20)
        .step(0.1)
        .name('Camera Target y')
        .listen();
      this.debug
        .add(this.controls.target, 'z')
        .min(-20)
        .max(20)
        .step(0.1)
        .name('Camera Target z')
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
    this.cameraControls.azimuthRotateSpeed = 0.1;
    this.cameraControls.polarRotateSpeed = 0.1;
    this.cameraControls.dollySpeed = 0.1;
    this.cameraControls.truckSpeed = 0.5; // pan speed

    this.cameraControls.minDistance = 10;
    this.cameraControls.maxDistance = 50;
    this.cameraControls.minAzimuthAngle = Math.PI * 0.2;
    this.cameraControls.maxAzimuthAngle = Math.PI * 0.8;
    this.cameraControls.minPolarAngle = Math.PI * 0.2;
    this.cameraControls.maxPolarAngle = Math.PI * 0.4;

    this.boundary = new THREE.Box3(
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(10, 10, 10)
    );
    this.boundaryHelper = new THREE.Box3Helper(this.boundary, 0xffff00);

    this.cameraControls.setBoundary(this.boundary);
    // this.cameraControls.boundaryEnclosesCamera = true;

    this.time.on('tick', () => {
      this.cameraControls.update(1 / this.time.delta);
    });

    // test camera transition on button click
    document
      .querySelector('.customizer__camera-control')
      .addEventListener('click', (e) => {
        this.cameraControls.rotate(45 * THREE.MathUtils.DEG2RAD, 0, true);
      });
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
      });
      this.cameraControls.addEventListener('update', () => {
        // console.log('camera update');
        this.trigger('cameraupdate');
      });
    }
  }

  startCameraInitialFly() {
    this.cameraControls.azimuthRotateSpeed = 0.01;
    this.cameraControls.polarRotateSpeed = 0.01;
    this.cameraControls.dollySpeed = 0.01;

    this.cameraControls.setPosition(18, 8, 10, true);
    3;
    this.cameraControls.azimuthRotateSpeed = 0.1;
    this.cameraControls.polarRotateSpeed = 0.1;
    this.cameraControls.dollySpeed = 0.1;
  }
}
