import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// import { Camera } from 'three';

export default class Camera {
  constructor(_options) {
    this.fov = _options.fov;
    this.sizes = _options.sizes;
    this.debug = _options.debug;
    this.renderer = _options.renderer;
    this.time = _options.time;

    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setInstance();
    // this.setOrbitControls();
  }

  setInstance() {
    // Set Camera instance
    this.instance = new THREE.PerspectiveCamera(
      this.fov,
      this.sizes,
      0.1,
      1000
    );

    this.instance.position.set(20, 10, 8);

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
}
