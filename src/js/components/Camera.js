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
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      this.fov,
      this.sizes,
      0.1,
      1000
    );

    this.instance.position.set(8, 3, 7);

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

    // set initial camera target
    this.controls.target.set(3, 5, 1);

    this.time.on('tick', () => {
      this.controls.update(); // needed for controls transitions on mouse up
    });

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
